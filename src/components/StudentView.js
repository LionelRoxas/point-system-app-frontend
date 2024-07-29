import React, { useState, useEffect } from 'react';
import './StudentView.css';
import axios from 'axios';
import HistoryDetail from './HistoryDetail';

const StudentView = ({ classCode, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/students', {
          params: { classCode },
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sort students by points in descending order
        const sortedStudents = response.data.sort((a, b) => b.points - a.points);
        setStudents(sortedStudents);
      } catch (error) {
        setError('Error fetching students: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (classCode) {
      fetchStudents();
    }
  }, [classCode]);

  const handleViewHistory = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="student-view">
      <button onClick={onBack} className="back-button">Back to Selection</button>
      {selectedStudent ? (
        <HistoryDetail student={selectedStudent} onBack={handleBackToStudents} />
      ) : (
        <>
          <h1>Member View</h1>
          {loading && <p>Loading members...</p>}
          {error && <p>{error}</p>}
          <h2>Group Code: {classCode}</h2>
          {students.length > 0 ? (
            <table className="student-table">
              <thead>
                <tr>
                  <th className="header-label">Rank</th>
                  <th className="header-label">Name</th>
                  <th className="header-label">Points</th>
                  <th className="header-label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} className={`rank-${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.points}</td>
                    <td>
                      <button onClick={() => handleViewHistory(student)}>View History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No members found for this group code.</p>
          )}
        </>
      )}
    </div>
  );
};

export default StudentView;

