import React from 'react';

const PatternView = ({ pattern, levelName, description, challengeType }) => {
    return (
        <div className="pattern-wrapper" style={{
            height: '100%', width: '100%',
            background: '#050510', position: 'relative',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div className="pane-header" style={{
                padding: '10px 20px',
                background: '#1a1a2e',
                color: '#00ffff',
                fontFamily: 'Orbitron',
                fontSize: '0.9rem',
                borderBottom: '1px solid #333',
                letterSpacing: '2px'
            }}>
                CHALLENGE_SPECIFICATION: {levelName || "UNKNOWN"}
            </div>

            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {description && (
                    <div className="description-section">
                        <h4 style={{ color: '#00e5ff', fontFamily: 'monospace', marginBottom: '10px' }}>&gt; OBJECTIVE:</h4>
                        <p style={{ color: '#ccc', fontFamily: 'monospace', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            {description}
                        </p>
                    </div>
                )}

                <div className="output-section">
                    <h4 style={{ color: '#ff00ff', fontFamily: 'monospace', marginBottom: '10px' }}>
                        &gt; {challengeType === 'pattern' ? 'EXPECTED_PATTERN:' : 'EXPECTED_OUTPUT:'}
                    </h4>
                    <pre style={{
                        color: challengeType === 'pattern' ? '#ff00ff' : '#00e5ff',
                        textShadow: challengeType === 'pattern' ? '0 0 5px #ff00ff' : '0 0 5px #00e5ff',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        lineHeight: '1.4',
                        margin: 0,
                        background: 'rgba(0,0,0,0.3)',
                        padding: '15px',
                        border: '1px dashed #333'
                    }}>
                        {pattern}
                    </pre>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                padding: '10px',
                background: '#0a0a0a',
                borderTop: '1px solid #333',
                fontSize: '0.7rem',
                color: '#444',
                letterSpacing: '1px'
            }}>
                BCA_DEPT_HACKATHON_V2.0 // STATUS: READY
            </div>
        </div>
    );
};

export default PatternView;
