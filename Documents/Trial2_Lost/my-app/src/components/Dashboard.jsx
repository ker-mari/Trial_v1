import React from 'react';

const Dashboard = ({ userName, itemsCount, onNavigate }) => {
  return (
    <div className="dashboard-screen">
      <div className="greeting">
        <p className="currently-text">Currently at your service,</p>
        <h2 className="user-name">{userName}</h2>
      </div>
      <div className="dashboard-content">
        <h2 className="dashboard-title">Together, we bring things back!</h2>
        <p className="dashboard-subtitle">Found or lost something? Don't worry — help is just a click away!</p>
        <div className="button-grid">
          <button className="action-btn view-item-btn" onClick={() => onNavigate('viewItems')}>
            View Items ({itemsCount})
          </button>
          <button className="action-btn handover-btn" onClick={() => onNavigate('handOver')}>
            Hand Over Item
          </button>
        </div>
        <div className="button-grid-bottom">
          <button className="action-btn history-btn" onClick={() => onNavigate('history')}>
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;