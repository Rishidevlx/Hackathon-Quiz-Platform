const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.TIDB_HOST,
        port: process.env.TIDB_PORT || 4000,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    });

    try {
        console.log('Connected to TiDB Cluster!');

        // 1. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.TIDB_DATABASE}`);
        await connection.query(`USE ${process.env.TIDB_DATABASE}`);
        console.log(`Using database: ${process.env.TIDB_DATABASE}`);

        // 2. Create Users Table
        const userTable = `
            CREATE TABLE IF NOT EXISTS users (
                roll_number VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100),
                college_name VARCHAR(150),
                category ENUM('UG', 'PG') NOT NULL,
                status ENUM('active', 'finished', 'disqualified') DEFAULT 'active',
                start_time BIGINT,
                end_time BIGINT,
                total_time BIGINT DEFAULT 0,
                score INT DEFAULT 0,
                warnings INT DEFAULT 0,
                patterns_completed INT DEFAULT 0,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await connection.query(userTable);
        console.log('Table "users" created.');

        // 3. Create Challenges Table (Replaces patterns)
        const challengeTable = `
            CREATE TABLE IF NOT EXISTS challenges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                description TEXT,
                target_output TEXT,
                level_order INT,
                category ENUM('UG', 'PG') NOT NULL,
                challenge_type ENUM('logic', 'pattern') DEFAULT 'logic',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(challengeTable);
        console.log('Table "challenges" created.');

        // 4. Create Code States Table
        const codeStateTable = `
            CREATE TABLE IF NOT EXISTS code_states (
                id INT AUTO_INCREMENT PRIMARY KEY,
                roll_number VARCHAR(50),
                challenge_id INT,
                code LONGTEXT,
                language VARCHAR(20),
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (roll_number) REFERENCES users(roll_number) ON DELETE CASCADE
            )
        `;
        await connection.query(codeStateTable);
        console.log('Table "code_states" created.');

        // 5. Create System Config Table
        const configTable = `
            CREATE TABLE IF NOT EXISTS system_config (
                setting_key VARCHAR(50) PRIMARY KEY,
                setting_value TEXT
            )
        `;
        await connection.query(configTable);
        console.log('Table "system_config" created.');

        // 6. Insert Default Settings
        const defaultSettings = [
            ['SESSION_DURATION_MINUTES', '120'],
            ['PASTE_SECURITY', 'true'],
            ['FOCUS_SECURITY', 'true']
        ];

        for (const [key, value] of defaultSettings) {
            await connection.query(`
                INSERT INTO system_config (setting_key, setting_value) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            `, [key, value]);
        }
        console.log('Default settings initialized.');

        // 7. Insert Dummy Challenges for Testing
        const dummyChallenges = [
            // UG Challenges
            ['Sum of Natural Numbers', 'Write a program to calculate the sum of natural numbers up to 50.', 'Sum = 1275', 1, 'UG', 'logic'],
            ['Simple Pattern', 'Print a 5x5 square of asterisks.', '* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *', 2, 'UG', 'pattern'],
            
            // PG Challenges
            ['Factorial Calculation', 'Write a program to find the factorial of 10.', 'Factorial = 3628800', 1, 'PG', 'logic'],
            ['Hollow Triangle', 'Print a hollow triangle pattern.', '*\n* *\n*   *\n*     *\n* * * * *', 2, 'PG', 'pattern']
        ];

        for (const [name, desc, target, order, cat, type] of dummyChallenges) {
            await connection.query(`
                INSERT INTO challenges (name, description, target_output, level_order, category, challenge_type) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [name, desc, target, order, cat, type]);
        }
        console.log('Dummy challenges inserted for testing.');

        console.log('Database Migration & Initialization Complete! 🚀');
        process.exit(0);
    } catch (err) {
        console.error('Error during DB init:', err);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

initDB();
