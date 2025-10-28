import React from 'react';

const HistoryPage = ({ historyItems }) => {
  return (
    <div className="history-screen">
      <h1 className="history-title">HISTORY PAGE</h1>
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date ↑</th>
              <th>Code ▼</th>
              <th>Item Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Officer</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item, index) => (
              <tr key={index} className={index % 2 === 1 ? "gray-row" : ""}>
                <td>{item.date}</td>
                <td><span className={`code-badge ${item.code === 'V' ? 'valuable' : 'lost'}`}>{item.code}</span></td>
                <td>{item.itemName}</td>
                <td>{item.owner}</td>
                <td>{item.status}</td>
                <td>{item.officer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;