import React, { useState, useEffect } from 'react';

const categoryEmojis = {
  'Personal Belongings': 'https://cdn-icons-png.flaticon.com/512/8093/8093479.png',
  'School Supplies': 'https://cdn-icons-png.flaticon.com/512/5311/5311017.png',
  'Clothing': 'https://cdn-icons-png.flaticon.com/512/4634/4634005.png',
  'Accessories': 'https://cdn-icons-png.flaticon.com/512/941/941330.png',
  'Miscellaneous / Others': 'https://cdn-icons-png.flaticon.com/512/5692/5692058.png',
  'Documents / Identification': 'https://cdn-icons-png.flaticon.com/512/2997/2997954.png',
  'Gadgets / Electronics': 'https://cdn-icons-png.flaticon.com/512/7214/7214359.png',
  'Money and Payment Items': 'https://cdn-icons-png.flaticon.com/512/1198/1198333.png',
  'Identification and Wallets': '💳',
  'Bags and Storage': 'https://cdn-icons-png.flaticon.com/512/3275/3275955.png',
  'Jewelry / Valuables': 'https://cdn-icons-png.flaticon.com/512/4689/4689250.png'
};

export const ItemDetailsModal = ({ selectedItem, onClose, onClaim, onEdit }) => {
  const [isClicking, setIsClicking] = useState(false);
  
  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">Item's Information</h2>
        <div className="modal-body">
          <div className="modal-image-container">
            <div className="modal-image-placeholder">
              {selectedItem.image && (selectedItem.image.startsWith('http') || selectedItem.image.startsWith('data:image/')) ? (
                <img src={selectedItem.image} alt="Item" style={{maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px'}} />
              ) : (
                categoryEmojis[selectedItem.category]?.startsWith('http') ? (
                  <img src={categoryEmojis[selectedItem.category]} alt={selectedItem.category} style={{maxWidth: '400px', maxHeight: '300px', objectFit: 'contain'}} />
                ) : (
                  categoryEmojis[selectedItem.category] || '📦'
                )
              )}
            </div>
          </div>
          <div className="modal-details-container">
            <h3>Item no. {selectedItem.itemNo || selectedItem.id}</h3>
            <p className="modal-category">{selectedItem.category}</p>
            <p className="modal-info-label">Location Found</p>
            <p className="modal-info-value">{selectedItem.location}</p>
            <p className="modal-info-label">Date and Time</p>
            <p className="modal-info-value">
              {selectedItem.dateTime || selectedItem.found_date || selectedItem.date_time || selectedItem.created_at 
                ? new Date(selectedItem.dateTime || selectedItem.found_date || selectedItem.date_time || selectedItem.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Date not available'
              }
            </p>
            <hr className="modal-divider" />
            <p className="modal-info-label">Description</p>
            <p className="modal-info-value">{selectedItem.description}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-action-btn claim-btn" 
            disabled={isClicking}
            onClick={() => {
              if (isClicking) return;
              setIsClicking(true);
              onClaim();
              setTimeout(() => setIsClicking(false), 1000);
            }}
          >
            {isClicking ? 'Loading...' : 'Claim'}
          </button>
          <button 
            className="modal-action-btn edit-btn" 
            disabled={isClicking}
            onClick={() => {
              if (isClicking) return;
              setIsClicking(true);
              onEdit();
              setTimeout(() => setIsClicking(false), 1000);
            }}
          >
            {isClicking ? 'Loading...' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ClaimFormModal = ({ selectedItem, userName, onClose, onSubmit }) => {
  // Helper function to get current datetime in local format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [claimFormData, setClaimFormData] = useState({
    ownerName: '',
    ownerId: '',
    ownerGrade: '',
    claimDate: getCurrentDateTime()
  });

  // Set current date/time when component mounts or selectedItem changes
  useEffect(() => {
    setClaimFormData(prev => ({
      ...prev,
      claimDate: getCurrentDateTime()
    }));
  }, [selectedItem]);

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
      <div className="hand-over-form-container claim-form-style">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <h1 className="hand-over-title">CLAIM FORM</h1>
        
        <div className="hand-over-form">
          <div className="form-header">
            <div className="form-section-title">
              <label>Item's Information</label>
            </div>
            <div className="on-duty-label">
              <label>ON DUTY: "{userName}"</label>
            </div>
          </div>
          
          <div className="claim-item-display">
            <div className="claim-info-row">
              <div className="claim-info-item">
                <strong>Item No.:</strong> <span>{selectedItem.item_no || selectedItem.id}</span>
              </div>
              <div className="claim-info-item">
                <strong>Item Category:</strong> <span>{selectedItem.category}</span>
              </div>
            </div>

            <div className="claim-info-row">
              <div className="claim-info-item">
                <strong>Date and Time</strong> <span className="tagalog-hint">(Araw at oras nong nakita)</span>
                <div>{new Date(selectedItem.date_time || selectedItem.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="claim-info-item">
                <strong>On Duty when Handed Over:</strong>
                <div>{selectedItem.officer || 'N/A'}</div>
              </div>
            </div>

            <div className="claim-info-row">
              <div className="claim-info-item">
                <strong>Location Found</strong>
                <div>{selectedItem.location}</div>
              </div>
              <div className="claim-info-item">
                <strong>Description</strong>
                <div>{selectedItem.description}</div>
              </div>
            </div>
          </div>
          
          <hr className="form-divider" />
          
          <div className="form-section-title">
            <label>Owner's Information <span className="tagalog-hint">(Detalye ng may-ari o kukuha ng item)</span></label>
          </div>
          
          <div className="form-grid claim-grid">
            <div className="form-field">
              <label>Owner's Name <span className="tagalog-hint">(Pangalan)</span> <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Enter owner's name"
                className="form-input"
                value={claimFormData.ownerName}
                onChange={(e) => updateClaimFormData('ownerName', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Owner's ID <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Enter owner's ID"
                className="form-input"
                value={claimFormData.ownerId}
                onChange={(e) => updateClaimFormData('ownerId', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Grade Section/Course <span className="tagalog-hint">(Baitang/Course)</span> <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Enter grade/course"
                className="form-input"
                value={claimFormData.ownerGrade}
                onChange={(e) => updateClaimFormData('ownerGrade', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Date and Time of Claim <span className="tagalog-hint">(Petsa at Oras ng Pag-claim)</span> <span className="required">*</span></label>
              <input
                type="datetime-local"
                className="form-input"
                value={claimFormData.claimDate}
                onChange={(e) => updateClaimFormData('claimDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-footer">
            <button 
              type="button" 
              className={`submit-btn ${claimFormData.ownerName && claimFormData.ownerId && claimFormData.ownerGrade && claimFormData.claimDate ? 'active' : ''}`}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditFormModal = ({ selectedItem, userName, onClose, onSubmit }) => {
  const originalData = {
    category: selectedItem?.category || '',
    date: selectedItem?.found_date || selectedItem?.date_time || selectedItem?.created_at || '',
    location: selectedItem?.location || '',
    description: selectedItem?.description || ''
  };
  
  const [editFormData, setEditFormData] = useState(originalData);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hasChanges = JSON.stringify(editFormData) !== JSON.stringify(originalData);

  const updateEditFormData = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Validate required fields
    if (!editFormData.category || !editFormData.location ||
        !editFormData.date || !editFormData.description) {
      setNotificationMessage('Please fill in all required fields');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Validate description length
    if (editFormData.description.trim().length < 5) {
      setNotificationMessage('Description must be at least 5 characters');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(editFormData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modern-edit-modal">
        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Edit Item Information</h2>
          <button className="edit-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="edit-modal-body">
          <div className="form-header">
            <div className="form-section-title">
              <label>Item No.: {selectedItem.itemNo || String(selectedItem.id).padStart(5, '0')}</label>
            </div>
            <div className="on-duty-label">
              <label>ON DUTY: {userName}</label>
            </div>
          </div>
          
          <div className="edit-item-no">
            <div className="edit-field-label">Item's Information <span className="tagalog-hint">(Detalye ng Item)</span></div>
          </div>
          
          <div className="form-grid">
            
            <div className="edit-field">
              <label className="edit-field-label">Item Category <span className="tagalog-hint">(Kategorya ng Item)</span> <span className="required">*</span></label>
              <select 
                className="edit-input" 
                value={editFormData.category}
                onChange={(e) => updateEditFormData('category', e.target.value)}
              >
                <option value="Personal Belongings">Personal Belongings</option>
                <option value="School Supplies">School Supplies</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Miscellaneous / Others">Miscellaneous / Others</option>
                <option value="Documents / Identification">Documents / Identification</option>
                <option value="Gadgets / Electronics">Gadgets / Electronics</option>
                <option value="Money and Payment Items">Money and Payment Items</option>
                <option value="Identification and Wallets">Identification and Wallets</option>
                <option value="Bags and Storage">Bags and Storage</option>
                <option value="Jewelry / Valuables">Jewelry / Valuables</option>
              </select>
            </div>
            
            <div className="edit-field">
              <label className="edit-field-label">Location Found <span className="tagalog-hint">(Lokasyon kung saan nakita)</span> <span className="required">*</span></label>
              <select 
                className="edit-input" 
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
                <option value="DSR 3rd Floor">DSR 3rd Floor</option>
                <option value="DSR 4th Floor">DSR 4th Floor</option>
              </select>
            </div>
            
            <div className="edit-field">
              <label className="edit-field-label">Date and Time <span className="tagalog-hint">(Petsa at Oras)</span> <span className="required">*</span></label>
              <input 
                type="datetime-local" 
                className="edit-input" 
                value={editFormData.date ? (editFormData.date.includes('T') ? editFormData.date.slice(0, 16) : new Date(editFormData.date).toISOString().slice(0, 16)) : ''}
                onChange={(e) => updateEditFormData('date', e.target.value)}
              />
            </div>
            
            <div className="edit-field">
              <label className="edit-field-label">Description <span className="tagalog-hint">(Ilarawan ang Item)</span> <span className="required">*</span></label>
              <textarea 
                placeholder="Please provide a description of the item" 
                className="edit-textarea" 
                value={editFormData.description}
                onChange={(e) => updateEditFormData('description', e.target.value)}
                rows="3"
              />
            </div>
            

          </div>
        </div>
        
        <div className="edit-modal-footer">
          <button className="edit-cancel-btn" onClick={onClose}>Cancel</button>
          <div className="button-wrapper">
            <button 
              className={`edit-save-btn ${!hasChanges || isSubmitting ? 'disabled' : ''}`} 
              onClick={handleSubmit}
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            {!hasChanges && (
              <div className="tooltip">No changes made</div>
            )}
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <span className="notification-icon">⚠️</span>
            <span className="notification-text">{notificationMessage}</span>
          </div>
        </div>
      )}
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
              Close
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