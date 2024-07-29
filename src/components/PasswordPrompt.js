// src/components/PasswordPrompt.js

import React, { useState } from 'react';
import './PasswordPrompt.css';

const PasswordPrompt = ({ onLogin, onRegister, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister(email, password);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="password-prompt">
      <h1>{isRegistering ? 'Register' : 'Admin Login'}</h1>
      {!isRegistering && (
        <p className="registration-info">
          If this is your first time, please <button type="button" onClick={() => setIsRegistering(true)}>Register</button> first.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        {isRegistering && (
          <button type="button" onClick={() => setIsRegistering(false)}>
            Back to Login
          </button>
        )}
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PasswordPrompt;

