// src/components/Auth.tsx
import React, { useState } from 'react';
import Login from './LoginPage';
import Register from './RegisterPage';



const AuthViewHelper = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState('login');

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');

  return (
    <div>
      {currentView === 'login' ? (
        <Login 
          onSuccess={onAuthSuccess}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <Register 
          onSuccess={switchToLogin}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
};

export default AuthViewHelper;