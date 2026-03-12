import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onLogin, onBack, category }) => {
    const [rollNo, setRollNo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!rollNo) {
            setError('ACCESS DENIED: MISSING ROLL NUMBER');
            return;
        }

        // Normalizing roll number to lowercase
        const normalizedRollNo = rollNo.toLowerCase().trim();

        // Save session data to localStorage
        const sessionData = {
            lotNo: normalizedRollNo, // For backward compatibility with existing code
            rollNo: normalizedRollNo,
            category: category,
            loginTime: Date.now()
        };
        localStorage.setItem('qmaze_user_session', JSON.stringify(sessionData));

        onLogin(normalizedRollNo, normalizedRollNo, category);
    };

    return (
        <div className="login-overlay">
            <div className="login-frame">
                <div className="login-header">
                    <div className="scanner-line"></div>
                    <div className="category-badge">{category}_PROGRAM_STUDENT</div>
                    <h2 className="login-title">HACKATHON LOGIN</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-field-container">
                        <label>ENTER ROLL NUMBER</label>
                        <div className="input-wrapper">
                            <span className="input-prefix">&gt;&gt;</span>
                            <input
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                placeholder="eg: 23uca239"
                                autoFocus
                                autoComplete="off"
                                style={{ letterSpacing: '2px' }}
                            />
                        </div>
                        <p className="input-hint">Case-insensitive. Alphanumeric only.</p>
                    </div>

                    {error && <div className="error-msg">system_alert: {error}</div>}

                    <div className="action-buttons">
                        <button type="button" className="ghost-btn" onClick={onBack}>ABORT</button>
                        <button type="submit" className="neon-btn">ENTER_HACKATHON</button>
                    </div>
                </form>

                <div className="login-footer">
                    <span>SECURE_BCA_DEPT_CONNECTION</span>
                    <span>HACKATHON_V2026.0</span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
