import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import BackgroundEffect from './BackgroundEffect';

const LandingPage = ({ onStart }) => {
    const [glitch, setGlitch] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [displayText, setDisplayText] = useState('START_SYSTEM');
    const originalText = 'START_SYSTEM';
    const containerRef = useRef(null);

    // Parallax Tilt State
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;

        // Calculate tilt (limit to +/- 20deg)
        setOffset({
            x: (x / width) * 20,
            y: (y / height) * 20
        });
    };

    const handleButtonHover = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                prev.split('').map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[Math.floor(Math.random() * 26)];
                }).join('')
            );
            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    };

    const handleButtonLeave = () => {
        setDisplayText(originalText);
    };

    return (
        <div className="landing-container" onMouseMove={handleMouseMove}>
            <BackgroundEffect />
            <div className="overlay"></div>

            <header className="landing-header">
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
                    <h1 className={`qumaze-title ${glitch ? 'glitching' : ''}`} data-text="HACKATHON 2K26">
                        HACKATHON 2K26
                    </h1>
                </main>
            </div>

            <h2 className="event-subtitle">BCA DEPT - HACKATHON</h2>

            {!showCategories ? (
                <button
                    className="start-btn"
                    onClick={() => setShowCategories(true)}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                >
                    <span className="btn-bracket">[</span>
                    <span className="btn-text">{displayText}</span>
                    <span className="btn-bracket">]</span>
                </button>
            ) : (
                <div className="category-selection-overlay">
                    <div className="category-card ug-card" onClick={() => onStart('UG')}>
                        <div className="card-glitch-bg"></div>
                        <div className="card-content">
                            <h3 className="card-title">UG_PROGRAM</h3>
                            <p className="card-desc">UNDERGRADUATE CHALLENGE</p>
                            <span className="card-select">[ SELECT_PATH ]</span>
                        </div>
                    </div>
                    <div className="category-card pg-card" onClick={() => onStart('PG')}>
                        <div className="card-glitch-bg"></div>
                        <div className="card-content">
                            <h3 className="card-title">PG_PROGRAM</h3>
                            <p className="card-desc">POSTGRADUATE CHALLENGE</p>
                            <span className="card-select">[ SELECT_PATH ]</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
