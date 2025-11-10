import React from 'react';

const HandOverSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{textAlign: 'center', padding: '2rem'}}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 1.5rem'
          }}>
            ✓
          </div>
          <h2 style={{color: '#333', fontSize: '1.5rem', marginBottom: '1rem'}}>
            Item Handed Over Successfully
          </h2>
          <p style={{color: '#666', fontSize: '1rem', lineHeight: '1.5', marginBottom: '2rem'}}>
            Now waiting to be reunited with its owner!
          </p>
          <button
            className="modal-action-btn claim-btn"
            onClick={onClose}
            style={{minWidth: '120px'}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditSuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="approval-success-modal">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>
              {message.includes('successfully') ? 'Changes Saved!' : 'Changes Sent!'}
            </h2>
            <p className="success-message">
              {message.includes('successfully') ? 'Item has been updated successfully.' : 'Your edits have been submitted for admin approval.'}
            </p>
          </div>
          <button 
            className="modal-action-btn claim-btn"
            onClick={onClose}
            style={{ marginTop: '1rem' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const AppModals = ({ 
  isHandOverSuccessModalOpen, 
  onCloseHandOverSuccessModal,
  showEditSuccessModal,
  editSuccessMessage,
  onCloseEditSuccessModal
}) => {
  return (
    <>
      <HandOverSuccessModal 
        isOpen={isHandOverSuccessModalOpen}
        onClose={onCloseHandOverSuccessModal}
      />
      <EditSuccessModal 
        isOpen={showEditSuccessModal}
        message={editSuccessMessage}
        onClose={onCloseEditSuccessModal}
      />
    </>
  );
};

export default AppModals;