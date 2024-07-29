import React, { useState } from 'react';
import './ClassCodePrompt.css';

const ClassCodePrompt = ({ onSubmit, onCancel }) => {
  const [classCode, setClassCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(classCode);
  };

  return (
    <div className="class-code-prompt">
      <h2>Enter Group Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          placeholder="Class Code"
          required
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ClassCodePrompt;


