import React, { useState } from 'react';

export const ItemDetailsModal = ({ selectedItem, onClose, onClaim, onEdit }) => {
  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          Close &times;
        </button>
        <h2 className="modal-title">Item's Information</h2>
        <div className="modal-body">
          <div className="modal-image-container">
            <div className="modal-image-placeholder">{selectedItem.image}</div>
          </div>
          <div className="modal-details-container">
            <h3>Item no.: {selectedItem.itemNo || String(selectedItem.id).padStart(5, '0')}</h3>
            <p className="modal-category">{selectedItem.category}</p>
            <p className="modal-info-label">Location Found</p>
            <p className="modal-info-value">{selectedItem.location}</p>
            <p className="modal-info-label">Date and Time</p>
            <p className="modal-info-value">{selectedItem.dateTime || selectedItem.found_date}</p>
            <hr className="modal-divider" />
            <p className="modal-info-label">Description</p>
            <p className="modal-info-value">{selectedItem.description}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-action-btn claim-btn" onClick={onClaim}>Claim</button>
          <button className="modal-action-btn edit-btn" onClick={onEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export const ClaimFormModal = ({ selectedItem, userName, onClose, onSubmit }) => {
  const [claimFormData, setClaimFormData] = useState({
    ownerName: '',
    ownerId: '',
    ownerGrade: '',
    claimDate: ''
  });

  const updateClaimFormData = (field, value) => {
    setClaimFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!claimFormData.ownerName || !claimFormData.ownerId || !claimFormData.ownerGrade || !claimFormData.claimDate) {
      alert('Please fill in all owner information fields');
      return;
    }
    onSubmit(claimFormData);
  };

  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="claim-form-modal">
        <button className="modal-close-btn" onClick={onClose}>
          Close &times;
        </button>
        <h2 className="claim-form-title">CLAIM FORM</h2>
        <div className="claim-form-content">
          <div className="claim-form-section">
            <div className="claim-info-group">
              <h3>Item's Information</h3>
              <div className="claim-info-grid">
                <div className="claim-info-item">
                  <label>Item no.: {selectedItem.itemNo || String(selectedItem.id).padStart(5, '0')}</label>
                  <span>{selectedItem.category}</span>
                </div>
                <div className="claim-info-item">
                  <label>Date and Time</label>
                  <span>{selectedItem.dateTime || selectedItem.found_date}</span>
                </div>
                <div className="claim-info-item">
                  <label>Location Found</label>
                  <span>{selectedItem.location}</span>
                </div>
              </div>
              <div className="claim-description">
                <label>Description</label>
                <p>{selectedItem.description}</p>
              </div>
            </div>
            <div className="claim-duty-info">
              <label>ON DUTY: "{userName}"</label>
            </div>
          </div>
          
          <div className="claim-form-section">
            <h3>Owner's Information</h3>
            <div className="claim-owner-grid">
              <input 
                type="text" 
                placeholder="Student's Name" 
                className="claim-input" 
                value={claimFormData.ownerName}
                onChange={(e) => updateClaimFormData('ownerName', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Student's ID" 
                className="claim-input" 
                value={claimFormData.ownerId}
                onChange={(e) => updateClaimFormData('ownerId', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Grade/Course" 
                className="claim-input" 
                value={claimFormData.ownerGrade}
                onChange={(e) => updateClaimFormData('ownerGrade', e.target.value)}
              />
              <input 
                type="date" 
                placeholder="Date of Claim" 
                className="claim-input" 
                value={claimFormData.claimDate}
                onChange={(e) => updateClaimFormData('claimDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="claim-form-footer">
            <button className="claim-submit-btn" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditFormModal = ({ selectedItem, userName, onClose, onSubmit }) => {
  const [editFormData, setEditFormData] = useState({
    category: selectedItem?.category || '',
    date: selectedItem?.found_date || '',
    location: selectedItem?.location || '',
    description: selectedItem?.description || ''
  });

  const updateEditFormData = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(editFormData);
  };

  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="claim-form-modal">
        <button className="modal-close-btn" onClick={onClose}>
          Close &times;
        </button>
        <h2 className="claim-form-title">EDIT FORM</h2>
        <div className="claim-form-content">
          <div className="claim-form-section">
            <div className="claim-info-group">
              <h3>Item's Information</h3>
              <div className="claim-info-grid">
                <div className="claim-info-item">
                  <label>Item no.: {selectedItem.itemNo || String(selectedItem.id).padStart(5, '0')}</label>
                </div>
                <div className="claim-duty-info">
                  <label>ON DUTY: "{userName}"</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="claim-form-section">
            <h3>Edit Information</h3>
            <div className="claim-owner-grid">
              <select 
                className="claim-input" 
                value={editFormData.category}
                onChange={(e) => updateEditFormData('category', e.target.value)}
              >
                <option value="Personal Belongings">Personal Belongings</option>
                <option value="School Supplies">School Supplies</option>
                <option value="Sports Equipments">Sports Equipments</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Food and Drinks">Food and Drinks</option>
                <option value="Electronics">Electronics</option>
              </select>
              <input 
                type="date" 
                className="claim-input" 
                value={editFormData.date}
                onChange={(e) => updateEditFormData('date', e.target.value)}
              />
              <select 
                className="claim-input" 
                value={editFormData.location}
                onChange={(e) => updateEditFormData('location', e.target.value)}
              >
                <option value="Entrance Lobby">Entrance Lobby</option>
                <option value="Lobby 2 (Lost and Found Location)">Lobby 2 (Lost and Found Location)</option>
                <option value="EFS 1st Floor">EFS 1st Floor</option>
                <option value="EFS 2nd Floor">EFS 2nd Floor</option>
                <option value="EFS 3rd Floor">EFS 3rd Floor</option>
                <option value="EFS 4th Floor">EFS 4th Floor</option>
                <option value="DSR 1st Floor">DSR 1st Floor</option>
                <option value="DSR 2nd Floor">DSR 2nd Floor</option>
              </select>
              <textarea 
                placeholder="Description" 
                className="claim-input" 
                value={editFormData.description}
                onChange={(e) => updateEditFormData('description', e.target.value)}
                rows="3"
              />
            </div>
          </div>
          
          <div className="claim-form-footer">
            <button className="claim-submit-btn" onClick={handleSubmit}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuccessModal = ({ onClose, onViewHistory }) => {
  return (
    <div className="modal-overlay">
      <div className="success-modal">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <p className="success-message">
            Item successfully returned to owner,<br />
            and currently visible in History Page.
          </p>
          <div className="success-buttons">
            <button className="success-btn close-btn" onClick={onClose}>
              Close ✕
            </button>
            <button className="success-btn view-items-btn" onClick={onViewHistory}>
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};