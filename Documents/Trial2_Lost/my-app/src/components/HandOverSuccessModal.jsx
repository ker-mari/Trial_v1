import React from 'react';

const HandOverSuccessModal = ({ onClose, onViewDashboard }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#228B22"/>
            <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>Item Successfully Handed Over!</h2>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            View Items
          </button>
          <button className="btn-secondary" onClick={onViewDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandOverSuccessModal;