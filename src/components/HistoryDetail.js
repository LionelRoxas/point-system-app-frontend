// src/components/HistoryDetail.js

import React from 'react';
import './HistoryDetail.css';

const HistoryDetail = ({ student, onBack }) => {
  return (
    <div className="history-detail">
      <h2>History for {student.name}</h2>
      {student.history && student.history.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Entry</th>
            </tr>
          </thead>
          <tbody>
            {student.history.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No history available for this member.</p>
      )}
      <button className="back-button" onClick={onBack}>Back to Member View</button>
    </div>
  );
};

export default HistoryDetail;

