import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import BackgroundEffect from './BackgroundEffect';

const LandingPage = ({ onStart }) => {
    const [showCategories, setShowCategories] = useState(false);
    const [scrambledTitle, setScrambledTitle] = useState('');
    const [showSub, setShowSub] = useState(false);
    const [logs, setLogs] = useState([]);
    
    const fullTitle = "HACKATHON 2K26";
    const terminalLines = [
        "> INITIATING_SECURE_AUTH...",
        "> LOADING_VIRTUAL_ENV [OK]",
        "> CONNECTING_TIDB_CLUSTER [OK]",
        "> BYPASSING_FIREWALL... ACCESS_GRANTED",
        "> BCA_DEPT_PROTOCOL_ACTIVE",
        "> SYSTEM_VERSION_2.0.4_READY"
    ];

    useEffect(() => {
        // Scramble Title Animation
        let interval;
        let iteration = 0;
        
        interval = setInterval(() => {
            setScrambledTitle(
                fullTitle.split("")
                    .map((char, index) => {
                        if (index < iteration) return fullTitle[index];
                        return "X01#$@%&*"[Math.floor(Math.random() * 9)];
                    }).join("")
            );
            
            if (iteration >= fullTitle.length) {
                clearInterval(interval);
                setShowSub(true);
            }
            iteration += 1/3;
        }, 50);

        // Terminal Log Animation
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < terminalLines.length) {
                setLogs(prev => [...prev.slice(-5), terminalLines[logIndex]]);
                logIndex++;
            }
        }, 800);

        return () => {
            clearInterval(interval);
            clearInterval(logInterval);
        };
    }, []);

    return (
        <div className="landing-container">
            <BackgroundEffect />
            <div className="vignette-overlay"></div>
            <div className="scanline-overlay"></div>

            {!showCategories ? (
                <div className="main-viewport">
                    {/* Left: System Logs */}
                    <div className="system-logs">
                        {logs.map((log, i) => (
                            <div key={i} className="log-line">{log}</div>
                        ))}
                    </div>

                    {/* Right: Technical Badges */}
                    <div className="tech-badges">
                        <div className="badge">SEC_STATE: ENCRYPTED</div>
                        <div className="badge">UPTIME: 99.9%</div>
                        <div className="badge">LOCATION: RM_04_BCA</div>
                    </div>

                    {/* Center Content */}
                    <div className="center-content">
                        <header className="header-meta">
                            <span className="meta-line">AYYA NADAR JANAKI AMMAL COLLEGE</span>
                            <span className="meta-line highlight">BCA DEPARTMENT SPECIAL UNIT</span>
                        </header>

                        <div className="title-reconstruction">
                            <h1 className="main-title" data-text={scrambledTitle}>
                                {scrambledTitle}
                            </h1>
                            {showSub && (
                                <div className="sub-header-container">
                                    <div className="line-dec"></div>
                                    <span className="sub-text">CHALLENGE_YOUR_LIMITS</span>
                                    <div className="line-dec"></div>
                                </div>
                            )}
                        </div>

                        <div className="call-to-action">
                            <button className="hacker-btn" onClick={() => setShowCategories(true)}>
                                <div className="btn-content">
                                    <span className="btn-glitch-text">ACCESS_SYSTEM</span>
                                    <span className="btn-icon">_&gt;</span>
                                </div>
                                <div className="btn-border"></div>
                            </button>
                        </div>
                    </div>

                    {/* Bottom: Ticker Decoration */}
                    <div className="bottom-ticker">
                        <div className="ticker-track">
                                BCA_HACKATHON_2026 // CODE_MATCHING // LOGIC_TEST // SYSTEM_LOCKED // PERSIST_DATA // 
                                BCA_HACKATHON_2026 // CODE_MATCHING // LOGIC_TEST // SYSTEM_LOCKED // PERSIST_DATA // 
                        </div>
                    </div>
                </div>
            ) : (
                <div className="category-section">
                    <div className="category-header">
                        <h2 className="title-glow">SECTOR_SELECTION</h2>
                        <div className="path-indicator">PATH: ROOT/SELECTION</div>
                    </div>

                    <div className="category-grid">
                        <div className="rect-card" onClick={() => onStart('UG')}>
                            <div className="card-top">SECTOR_01</div>
                            <div className="card-body">
                                <h3>UG_LEVEL</h3>
                                <p>FOUNDATIONAL ALGORITHMS & PATTERN SYNTHESIS</p>
                                <div className="card-status">STATUS: ONLINE</div>
                            </div>
                            <div className="card-foot">INITIALIZE_PATH_&gt;&gt;</div>
                        </div>

                        <div className="rect-card" onClick={() => onStart('PG')}>
                            <div className="card-top">SECTOR_02</div>
                            <div className="card-body">
                                <h3>PG_LEVEL</h3>
                                <p>ADVANCED DATA VECTORS & LOGIC ARCHITECTURE</p>
                                <div className="card-status">STATUS: ONLINE</div>
                            </div>
                            <div className="card-foot">INITIALIZE_PATH_&gt;&gt;</div>
                        </div>
                    </div>

                    <button className="terminate-btn" onClick={() => setShowCategories(false)}>
                        [ TERMINATE_SELECTION ]
                    </button>
                </div>
            )}

            <div className="frame-decoration">
                <div className="corner-decor tl"></div>
                <div className="corner-decor tr"></div>
                <div className="corner-decor bl"></div>
                <div className="corner-decor br"></div>
            </div>
        </div>
    );
};

export default LandingPage;
