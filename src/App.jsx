import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import EditorLayout from './components/Editor/EditorLayout';

function App() {
  const [view, setView] = useState('landing'); // landing, login, editor
  const [category, setCategory] = useState('');
  const [userData, setUserData] = useState({ lotNo: '', lotName: '', collegeName: '', category: '' });

  // Auto-login check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedSession = localStorage.getItem('qmaze_user_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.lotNo || parsed.rollNo) {
            const id = parsed.rollNo || parsed.lotNo;
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me/${id}`);
            const data = await res.json();

            if (data.success && data.user) {
              setUserData({
                lotNo: data.user.roll_number || data.user.lot_number,
                lotName: data.user.name || data.user.lot_name,
                category: data.user.category,
                collegeName: data.user.college_name || '',
                dbStartTime: data.user.start_time,
                dbPatternsCompleted: data.user.patterns_completed,
                dbStatus: data.user.status,
                dbCodeData: data.user.code_data
              });
              setCategory(data.user.category);
            }
          }
        }
      } catch (err) {
        console.error('Error verifying session data', err);
      }
    };
    checkSession();
  }, []);

  const handleStart = (cat) => {
    setCategory(cat);
    setView('login');
  };

  const handleLogin = async (rollNo, name, cat) => {
    try {
      const initRes = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotNumber: rollNo, lotName: name, category: cat })
      });
      const initData = await initRes.json();

      if (initData.success && initData.user) {
        setUserData({
          lotNo: initData.user.roll_number,
          lotName: initData.user.name,
          category: initData.user.category,
          collegeName: initData.user.college_name || '',
          dbStartTime: initData.user.start_time,
          dbPatternsCompleted: initData.user.patterns_completed,
          dbStatus: initData.user.status,
          dbCodeData: initData.user.code_data
        });
        setView('editor');
      } else {
        setUserData({ lotNo: rollNo, lotName: name, category: cat });
        setView('editor');
      }
    } catch (err) {
      console.error("Login sync failed", err);
      setUserData({ lotNo: rollNo, lotName: name, category: cat });
      setView('editor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('qmaze_user_session');
    setUserData({ lotNo: '', lotName: '', collegeName: '' });
    setCategory('');
    setView('landing');
  };

  return (
    <div className="app-container">
      {view === 'landing' && <LandingPage onStart={handleStart} />}
      {view === 'login' && (
        <React.Fragment>
          <LandingPage onStart={() => { }} />
          <LoginModal onLogin={handleLogin} onBack={() => setView('landing')} category={category} />
        </React.Fragment>
      )}
      {view === 'editor' && (
        <EditorLayout userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
