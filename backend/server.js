const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- EXECUTION QUEUE CONFIG ---
const QUEUE_CONFIG = {
    c: { maxParallel: 5, maxQueue: 40, timeLimit: 2000, cooldown: 5000 },
    java: { maxParallel: 1, maxQueue: 20, timeLimit: 2000, cooldown: 5000 }
};

const executionQueues = { c: [], java: [] };
const activeExecutions = { c: 0, java: 0 };
const lastRequestTime = {}; 

// --- ROUTES ---

// 1. Participant Login
app.post('/api/login', async (req, res) => {
    const { lotNumber, lotName, category } = req.body; // Using 'lotNumber' from frontend request for compatibility
    console.log(`[LOGIN ATTEMPT] Roll: ${lotNumber}, Name: ${lotName}, Cat: ${category}`);
    
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE roll_number = ?', [lotNumber]);

        if (rows.length > 0) {
            console.log(`[LOGIN SUCCESS] Resuming session for ${lotNumber}`);
            return res.json({ success: true, user: rows[0], isNew: false });
        } else {
            console.log(`[LOGIN SUCCESS] Creating new session for ${lotNumber}`);
            const newUser = {
                roll_number: lotNumber,
                name: lotName,
                category: category || 'UG',
                status: 'active',
                score: 0,
                patterns_completed: 0
            };
            await db.query('INSERT INTO users SET ?', newUser);
            return res.json({ success: true, user: newUser, isNew: true });
        }
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Start Session
app.post('/api/start', async (req, res) => {
    const { lotNumber, language } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE roll_number = ?', [lotNumber]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const user = rows[0];
        if (!user.start_time) {
            const startTimeNum = Date.now();
            await db.query('UPDATE users SET start_time = ? WHERE roll_number = ?', [startTimeNum, lotNumber]);
            res.json({ success: true, start_time: startTimeNum });
        } else {
            res.json({ success: true, start_time: user.start_time });
        }
    } catch (err) {
        console.error('[START ERROR]', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Get Session Status
app.get('/api/me/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE roll_number = ?', [rollNumber]);
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('[ME ERROR]', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Get Challenges (HACKATHON UPDATED)
app.get('/api/patterns/:category', async (req, res) => {
    const { category } = req.params;
    try {
        // Renamed from 'patterns' to 'challenges'
        const [rows] = await db.query('SELECT * FROM challenges WHERE category = ? AND is_active = 1 ORDER BY level_order ASC', [category]);
        res.json(rows);
    } catch (err) {
        console.error('[CHALLENGES ERROR]', err);
        res.status(500).json({ error: err.message });
    }
});

// Bypassing /api/admin/patterns for frontend if it's used as fallback
app.get('/api/admin/patterns', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM challenges ORDER BY category, level_order ASC');
        res.json(rows);
    } catch (err) {
        console.error('[ADMIN CHALLENGES ERROR]', err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Execution (Queue)
app.post('/api/execute', async (req, res) => {
    const { language, code, lotNumber } = req.body;
    const langKey = language === 'c' ? 'c' : 'java';
    const config = QUEUE_CONFIG[langKey];
    
    try {
        const [rows] = await db.query('SELECT status FROM users WHERE roll_number = ?', [lotNumber]);
        if (rows.length === 0 || rows[0].status !== 'active') {
            return res.status(403).json({ message: "Session inactive or not found" });
        }

        const runtime = langKey === 'c' ? { language: 'c', versionIndex: '5' } : { language: 'java', versionIndex: '4' };
        
        const executionPromise = new Promise((resolve, reject) => {
            executionQueues[langKey].push({ code, runtime, resolve, reject });
        });

        processQueue(langKey);
        const result = await executionPromise;
        res.json(result);
    } catch (err) {
        console.error('[EXECUTE ERROR]', err);
        res.status(500).json({ message: err.message });
    }
});

// 6. Update Progress
app.post('/api/update-progress', async (req, res) => {
    const { lotNumber, challengeId, code, language, patternsCompleted, score } = req.body;
    try {
        await db.query(`
            UPDATE users SET patterns_completed = ?, score = ?, last_active = NOW() 
            WHERE roll_number = ?
        `, [patternsCompleted, score, lotNumber]);

        await db.query(`
            INSERT INTO code_states (roll_number, challenge_id, code, language)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE code = VALUES(code), language = VALUES(language)
        `, [lotNumber, challengeId, code, language]);

        res.json({ success: true });
    } catch (err) {
        console.error('[PROGRESS ERROR]', err);
        res.status(500).json({ success: false });
    }
});

// 7. System Settings
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM system_config');
        const settings = {};
        rows.forEach(row => settings[row.setting_key] = row.setting_value);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// JDoodle Logic
// Hardcoded fallback keys if .env is missing them
const FALLBACK_KEYS = [
    { id: "e9d4c44d39706bc115fd78d1fa94ae0b", secret: "2301490931d4fb5120c3a90054f4fdaf62adbab50e1c5340fb66a95834784950" },
    { id: "b30629e21f310dbf19aba52408e2a2a8", secret: "d6d0b3c5e9375561a3cb95bae07c99f682d80010bd2a8d11f431f49ff06c78e2" }
];
let currentKeyIndex = 0;

async function processQueue(lang) {
    if (activeExecutions[lang] >= QUEUE_CONFIG[lang].maxParallel) return;
    if (executionQueues[lang].length === 0) return;
    const job = executionQueues[lang].shift();
    activeExecutions[lang]++;

    try {
        const key = FALLBACK_KEYS[currentKeyIndex];
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: key.id,
                clientSecret: key.secret,
                script: job.code,
                language: job.runtime.language,
                versionIndex: job.runtime.versionIndex
            })
        });
        const data = await response.json();
        job.resolve({ run: { stdout: data.output || '', stderr: data.error || '', code: data.statusCode === 200 ? 0 : 1 } });
        currentKeyIndex = (currentKeyIndex + 1) % FALLBACK_KEYS.length;
    } catch (error) {
        console.error('[JDOODLE ERROR]', error);
        job.resolve({ run: { stderr: 'Execution Engine Error' } });
    } finally {
        activeExecutions[lang]--;
        processQueue(lang);
    }
}

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
