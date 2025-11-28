import React from 'react';

export const MainHeader = ({ screen, onDashboard, onLogout }) => {
  return (
    <header className="header">
      <div className="logo-section">
        <img src="/Logo.png" alt="logo" className="logo" />
        <h1><span className="la-verdad">LA VERDAD</span> <span className="lost-found">LOST N FOUND</span></h1>
      </div>
      {(screen === 'handOver' || screen === 'viewItems' || screen === 'history' || screen === 'approvalQueues' || screen === 'itemsToBeCleared' || screen === 'claimForm') && (
        <div className="header-middle">
          <h2 className="form-title">
            {screen === 'handOver' && 'HAND OVER FORM'}
            {screen === 'viewItems' && 'VIEW CLAIMABLE ITEMS'}
            {screen === 'history' && 'HISTORY PAGE'}
            {screen === 'approvalQueues' && 'APPROVAL QUEUES'}
            {screen === 'itemsToBeCleared' && 'ITEMS TO BE CLEARED'}
            {screen === 'claimForm' && 'CLAIM FORM'}
          </h2>
        </div>
      )}
      {screen === "dashboard" && (
        <div className="logout-section">
          <button className="logout-btn" onClick={onLogout}>
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" alt="Logout" className="btn-icon" />
            LOG OUT
          </button>
        </div>
      )}
      {screen !== "start" && screen !== "pin" && screen !== "dashboard" && (
        <div className="dashboard-link">
          <span onClick={onDashboard}>
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828673.png" alt="Dashboard" className="btn-icon" />
            DASHBOARD
          </span>
        </div>
      )}
      {/* For Menu button -> if kailangan   
      {(screen === "start" || screen === "pin") && (
        <div className="menu-icon">&#9776;</div>
      )} */}
    </header>
  );
};

export default MainHeader;