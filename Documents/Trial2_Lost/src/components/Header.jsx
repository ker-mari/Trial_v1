import React from 'react';

export const MainHeader = ({ screen, onDashboard }) => {
  if (screen === "start" || screen === "pin") {
    return (
      <header className="header">
        <div className="logo-section">
          <img src="/Logo.png" alt="logo" className="logo" />
          <h1><span>LA VERDAD</span> LOST N FOUND</h1>
        </div>
        <div className="menu-icon">&#9776;</div>
      </header>
    );
  }

  return (
    <header className="view-items-header">
      <div className="view-items-header-left">
        <img src="/Logo.png" alt="logo" className="logo" />
        <h2 className="view-items-title">LA VERDAD LOST N FOUND</h2>
      </div>
      <div className="dashboard-link">
        <span onClick={onDashboard}>&#9638; DASHBOARD</span>
      </div>
    </header>
  );
};

export default MainHeader;