// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';
import PasswordPrompt from './components/PasswordPrompt';
import ClassCodePrompt from './components/ClassCodePrompt';

function App() {
  const [students, setStudents] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showClassCodePrompt, setShowClassCodePrompt] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [classCode, setClassCode] = useState(localStorage.getItem('classCode') || '');

  const apiUrl = 'https://point-system-app-backend-1fa18c849427.herokuapp.com';

  useEffect(() => {
    if (token && classCode) {
      axios.get(`${apiUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { classCode }
      })
      .then(response => setStudents(response.data))
      .catch(error => console.error(error));
    }
  }, [token, classCode]);

  const addPoints = (studentId, points, reason) => {
    axios.post(`${apiUrl}/${studentId}/addPoints`, { points, reason, classCode }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setStudents(students.map(student =>
      student._id === studentId ? response.data : student
    )))
    .catch(error => console.error(error));
  };

  const addStudent = (name) => {
    axios.post(`${apiUrl}`, { name, points: 0, classCode }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setStudents([...students, response.data]))
    .catch(error => console.error(error));
  };

  const removeStudent = (studentId) => {
    axios.delete(`${apiUrl}/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setStudents(students.filter(student => student._id !== studentId)))
    .catch(error => console.error(error));
  };

  const handleTeacherView = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (email, password) => {
    axios.post(`${apiUrl}`, { email, password })
      .then(response => {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setClassCode(response.data.classCode);  // Store the class code
        localStorage.setItem('classCode', response.data.classCode);
        setUserRole('teacher');
        setShowPasswordPrompt(false);
      })
      .catch(error => alert('Incorrect email or password'));
  };

  const handleRegister = (email, password) => {
    axios.post(`${apiUrl}`, { email, password })
      .then(response => {
        alert('Registration successful! You can now log in.');
        setShowPasswordPrompt(false);
      })
      .catch(error => alert(error.response.data.message));
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setUserRole(null);
  };

  const handleClassCodeSubmit = (code) => {
    axios.post(`${apiUrl}`, { classCode: code })
    .then(response => {
      if (response.data.valid) {
        setClassCode(code);
        localStorage.setItem('classCode', code);
        setShowClassCodePrompt(false);
        setUserRole('student');
      } else {
        alert('Invalid class code');
      }
    })
    .catch(error => alert('Error validating class code'));
  };

  const handleBackToSelection = () => {
    setUserRole(null);
    setClassCode('');
    localStorage.removeItem('classCode');
  };

  return (
    <div className="App">
      {showPasswordPrompt && (
        <div className="password-prompt-overlay">
          <div className="password-prompt">
            <PasswordPrompt
              onLogin={handlePasswordSubmit}
              onRegister={handleRegister}
              onCancel={handlePasswordCancel}
            />
          </div>
        </div>
      )}
      {!showPasswordPrompt && !showClassCodePrompt && userRole === null && (
        <header className="App-header">
          <h1>Welcome to the Point System App!</h1>
          <p className="app-description">
            This versatile application enables organizations to manage and track points. Whether you're looking to recognize achievements,
            incentivize participation, or motivate performance, this app provides a user-friendly interface for managing points, monitoring progress,
            and redeeming rewards. To redeem your points, please email your Administrator to negotiate the rules and standards.
          </p>
            <button onClick={handleTeacherView}>Admin View</button>
            <button onClick={() => setShowClassCodePrompt(true)}>Member View</button>
        </header>
      )}
      {userRole === 'teacher' && !showPasswordPrompt && (
        <TeacherView
          students={students}
          addStudent={addStudent}
          removeStudent={removeStudent}
          addPoints={addPoints}
          classCode={classCode}
          onBack={handleBackToSelection}
        />
      )}
      {userRole === 'student' && !showClassCodePrompt && (
        <StudentView
          students={students}
          classCode={classCode}
          onBack={handleBackToSelection}
        />
      )}
      {showClassCodePrompt && (
        <div className="class-code-prompt-overlay">
          <div className="class-code-prompt">
            <ClassCodePrompt onSubmit={handleClassCodeSubmit} onCancel={() => setShowClassCodePrompt(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

