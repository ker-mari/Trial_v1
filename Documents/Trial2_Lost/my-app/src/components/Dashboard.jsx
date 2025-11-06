import React from 'react';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ userName, itemsCount, onNavigate, isAdmin }) => {
  if (isAdmin) {
    return <AdminDashboard userName={userName} itemsCount={itemsCount} onNavigate={onNavigate} />;
  }
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
          <button className="action-btn view-item-btn" onClick={() => onNavigate?.('viewItems')}>
            <img src="https://cdn-icons-png.flaticon.com/512/10473/10473538.png" alt="View" className="btn-icon" />
            View Items ({itemsCount || 0})
          </button>
          <button className="action-btn handover-btn" onClick={() => onNavigate?.('handOver')}>
            <img src="https://cdn-icons-png.flaticon.com/512/4116/4116184.png" alt="Handover" className="btn-icon" />
            Hand Over Item
          </button>
        </div>
        <div className="button-grid-bottom">
          <button className="action-btn history-btn" onClick={() => onNavigate?.('history')}>
            <img src="https://cdn-icons-png.flaticon.com/512/3503/3503786.png" alt="History" className="btn-icon" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;