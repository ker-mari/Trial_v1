import React, { useState, useEffect } from 'react';

const ClaimForm = ({ userName, selectedItem, onSubmit, onBack }) => {
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

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerId: '',
    ownerGrade: '',
    claimDate: getCurrentDateTime()
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  // Set current date/time when component mounts or selectedItem changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      claimDate: getCurrentDateTime()
    }));
  }, [selectedItem]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.ownerName) newErrors.ownerName = true;
    if (!formData.ownerId) newErrors.ownerId = true;
    if (!formData.ownerGrade) newErrors.ownerGrade = true;
    if (!formData.claimDate) newErrors.claimDate = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    
    onSubmit(formData);
  };

  if (!selectedItem) return null;

  return (
    <div className="hand-over-screen">
      <div className="hand-over-form-container">
        <form className="hand-over-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="form-section-title">
              <label>Item's Information <span className="tagalog-hint">(Detalye ng item)</span></label>
            </div>
            <div className="on-duty-label">
              <label>ON DUTY: "{userName}"</label>
            </div>
          </div>
          
          <div className="claim-item-display-optimized">
            <div className="claim-info-section">
              <div className="claim-info-row-balanced">
                <div className="claim-info-field-half">
                  <div className="claim-label-large">
                    Item No.: <span className="claim-value-inline">{selectedItem.item_no || selectedItem.id}</span>
                  </div>
                </div>

                <div className="claim-info-field-half">
                  <div className="claim-label-large">
                    Item Category: <span className="claim-value-inline">{selectedItem.category}</span>
                  </div>
                </div>
              </div>

              <div className="claim-info-row-balanced">
                <div className="claim-info-field-half">
                  <div className="claim-label-large">Date and Time <span className="tagalog-hint-large">(Araw at oras nong nakita)</span></div>
                  <div className="claim-value-large">{new Date(selectedItem.date_time || selectedItem.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</div>
                </div>

                <div className="claim-info-field-half">
                  <div className="claim-label-large">Officer:</div>
                  <div className="claim-value-large">{selectedItem.officer || 'N/A'}</div>
                </div>
              </div>

              <div className="claim-info-row-balanced">
                <div className="claim-info-field-half">
                  <div className="claim-label-large">Location Found</div>
                  <div className="claim-value-large">{selectedItem.location}</div>
                </div>

                <div className="claim-info-field-half">
                  <div className="claim-label-large">Description</div>
                  <div className="claim-value-large">{selectedItem.description}</div>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="form-divider" />
          
          <div className="form-section-title">
            <label>Owner's Information <span className="tagalog-hint">(Detalye ng may-ari o kukuha ng item)</span></label>
          </div>
          
          <div className="form-grid claim-grid-optimized">
            <div className="form-field">
              <label>Owner's Name <span className="tagalog-hint">(Pangalan)</span> <span className="required">*</span></label>
              <input
                type="text"
                name="ownerName"
                placeholder="Enter owner's name"
                className={`form-input-large ${errors.ownerName ? 'error' : ''}`}
                value={formData.ownerName}
                onChange={(e) => updateFormData('ownerName', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Owner's ID <span className="required">*</span></label>
              <input
                type="text"
                name="ownerId"
                placeholder="Enter owner's ID"
                className={`form-input-large ${errors.ownerId ? 'error' : ''}`}
                value={formData.ownerId}
                onChange={(e) => updateFormData('ownerId', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Grade Section/Course <span className="tagalog-hint">(Baitang/Course)</span> <span className="required">*</span></label>
              <input
                type="text"
                name="ownerGrade"
                placeholder="Enter grade/course"
                className={`form-input-large ${errors.ownerGrade ? 'error' : ''}`}
                value={formData.ownerGrade}
                onChange={(e) => updateFormData('ownerGrade', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Date and Time of Claim <span className="tagalog-hint">(Petsa at Oras ng Pag-claim)</span> <span className="required">*</span></label>
              <input
                type="datetime-local"
                name="claimDate"
                className={`form-input-large ${errors.claimDate ? 'error' : ''}`}
                value={formData.claimDate}
                onChange={(e) => updateFormData('claimDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={onBack}>Cancel</button>
            <button type="submit" className={`submit-btn ${formData.ownerName && formData.ownerId && formData.ownerGrade && formData.claimDate ? 'active' : ''}`}>Submit</button>
          </div>
        </form>
      </div>
      
      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <span className="notification-icon">⚠️</span>
            <span className="notification-text">Please fill in all fields</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimForm;