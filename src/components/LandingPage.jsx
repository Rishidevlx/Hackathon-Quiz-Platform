import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import BackgroundEffect from './BackgroundEffect';

const LandingPage = ({ onStart }) => {
    const [glitch, setGlitch] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [displayText, setDisplayText] = useState('START_SYSTEM');
    const [titleText, setTitleText] = useState('HACKATHON 2K26');
    const originalBtnText = 'START_SYSTEM';
    const originalTitle = 'HACKATHON 2K26';
    const containerRef = useRef(null);

    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Title Scramble Effect on Load
    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setTitleText(prev =>
                prev.split('').map((letter, index) => {
                    if (index < iterations) return originalTitle[index];
                    return "X01_#$@%&*"[Math.floor(Math.random() * 10)];
                }).join('')
            );
            if (iterations >= originalTitle.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 150);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;

        setOffset({
            x: (x / width) * 15,
            y: (y / height) * 15
        });
    };

    const handleButtonHover = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                prev.split('').map((letter, index) => {
                    if (index < iterations) return originalBtnText[index];
                    return "XY01#$@%&*"[Math.floor(Math.random() * 10)];
                }).join('')
            );
            if (iterations >= originalBtnText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    };

    const handleButtonLeave = () => {
        setDisplayText(originalBtnText);
    };

    return (
        <div className="landing-container" onMouseMove={handleMouseMove}>
            <BackgroundEffect />
            <div className="overlay"></div>

            {!showCategories ? (
                <>
                    <header className="landing-header">
                        <div className="sys-status">
                            <span className="status-dot pulse"></span>
                            <span className="status-text">SERVER_LOC: AP-SOUTHEAST-1</span>
                        </div>
                        <h3 className="dept-name">DEPARTMENT OF COMPUTER APPLICATIONS</h3>
                        <h4 className="college-name">AYYA NADAR JANAKI AMMAL COLLEGE (Autonomous)</h4>
                    </header>

                    <div
                        ref={containerRef}
                        className="tilt-wrapper"
                        style={{
                            transform: `perspective(1000px) rotateX(${offset.y * -1}deg) rotateY(${offset.x}deg)`
                        }}
                    >
                        <main className="landing-main">
                            <div className="cyber-frame">
                                <div className="frame-corner top-left"></div>
                                <div className="frame-corner top-right"></div>
                                <div className="frame-corner bottom-left"></div>
                                <div className="frame-corner bottom-right"></div>
                                
                                <div className="scanner-line-vertical"></div>
                                
                                <h1 className={`qumaze-title ${glitch ? 'glitching' : ''}`} data-text={titleText}>
                                    {titleText}
                                </h1>
                                <div className="title-sub">BCA DEPT // AUTH_PROTOCOL: 2.0.1</div>
                            </div>
                            
                            <h2 className="event-subtitle">
                                <span className="subtitle-glitch">BCA DEPT - HACKATHON</span>
                            </h2>
                        </main>
                    </div>

                    <div className="hacker-decorations">
                        <div className="decor-item">PROTOCOL: SECURE_SOCKET</div>
                        <div className="decor-item">IP_HASH: 0x4F5E6A</div>
                        <div className="decor-item">LATENCY: 12ms</div>
                    </div>

                    <button
                        className="start-btn"
                        onClick={() => setShowCategories(true)}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        <span className="btn-bracket">[</span>
                        <span className="btn-text">{displayText}</span>
                        <span className="btn-bracket">]</span>
                        <div className="btn-glow"></div>
                    </button>
                </>
            ) : (
                <div className="category-page">
                    <button className="back-btn" onClick={() => setShowCategories(false)}>
                        &lt; TERMINATE_PATH
                    </button>
                    
                    <div className="category-header">
                        <h2 className="category-title">SELECT_CHALLENGE_SECTOR</h2>
                        <div className="category-subtitle">VIRTUAL_ENVIRONMENT: INITIALIZED</div>
                        <div className="title-underline"></div>
                    </div>

                    <div className="category-list">
                        <div className="category-card-rect ug-card" onClick={() => onStart('UG')}>
                            <div className="card-indicator">01</div>
                            <div className="card-info">
                                <h3 className="card-title">UG_PROGRAM</h3>
                                <p className="card-desc">CORE_LOGIC & PATTERN_MATCHING SYSTEM</p>
                            </div>
                            <div className="card-action">
                                <span className="action-text">INITIALIZE_LINK</span>
                            </div>
                            <div className="card-glow"></div>
                        </div>

                        <div className="category-card-rect pg-card" onClick={() => onStart('PG')}>
                            <div className="card-indicator">02</div>
                            <div className="card-indicator-sub">PG_CORE</div>
                            <div className="card-info">
                                <h3 className="card-title">PG_PROGRAM</h3>
                                <p className="card-desc">ADVANCED_ALGORITHMIC_VECTORS</p>
                            </div>
                            <div className="card-action">
                                <span className="action-text">INITIALIZE_LINK</span>
                            </div>
                            <div className="card-glow"></div>
                        </div>
                    </div>
                </div>
            )}
            
            <footer className="landing-footer">
                <div className="sys-info">SYSTEM_v2.0 // DEPLOYED: {new Date().toLocaleDateString()}</div>
                <div className="sec-warning">CAUTION: AUTHORIZED ACCESS ONLY. ALL ACTIVITIES RECORDED.</div>
            </footer>
        </div>
    );
};

export default LandingPage;
