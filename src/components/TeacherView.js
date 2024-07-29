import React, { useState } from 'react';
import './TeacherView.css';

const TeacherView = ({ students, addStudent, removeStudent, addPoints, classCode, onBack }) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [reason, setReason] = useState('');

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      addStudent(newStudentName);
      setNewStudentName('');
    }
  };

  const handleAddPoints = () => {
    if (selectedStudent && pointsToAdd && reason) {
      addPoints(selectedStudent._id, parseInt(pointsToAdd), reason);
      setPointsToAdd('');
      setReason('');
    }
  };

  // Sort students alphabetically by name
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="teacher-view">
      <button className="back-button" onClick={onBack}>Back to Selection</button>
      <h1>Admin View</h1>
      <h2>Group Code: {classCode}</h2>

      <div className="actions-row">
        <div className="add-student-section">
          <h2>Add New Member</h2>
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Member Name or ID"
          />
          <button className="add-button" onClick={handleAddStudent}>Add Member</button>
        </div>

        <div className="add-points-section">
          <h2>Add Points to Member</h2>
          <label>Select Member:</label>
          <select onChange={(e) => setSelectedStudent(JSON.parse(e.target.value))}>
            <option value="">Select Member</option>
            {sortedStudents.map(student => (
              <option key={student._id} value={JSON.stringify(student)}>
                {student.name}
              </option>
            ))}
          </select>
          <label>Points:</label>
          <input
            type="number"
            value={pointsToAdd}
            onChange={(e) => setPointsToAdd(e.target.value)}
            placeholder="Points"
          />
          <label>Reason:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
          />
          <button className="add-button" onClick={handleAddPoints}>Add Points</button>
        </div>
      </div>

      <div className="student-list-section">
        <h2>Membership List</h2>
        <table className="student-table">
          <thead>
            <tr>
              <th className="header-label">Name</th>
              <th className="header-label">Points</th>
              <th className="header-label">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.points}</td>
                <td>
                  <button className="remove-button" onClick={() => removeStudent(student._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherView;

