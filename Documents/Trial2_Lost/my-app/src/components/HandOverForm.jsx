import React, { useState } from 'react';
import CameraCapture from './CameraCapture';

const HandOverForm = ({ userName, onSubmit, onNavigate }) => {
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
    category: 'Item',
    date: getCurrentDateTime(),
    location: 'Location',
    customLocation: '',
    description: '',
    finderName: '',
    finderGrade: '',
    finderId: '',
    image: ''
  });
  const [dropdowns, setDropdowns] = useState({
    category: false,
    location: false
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const newErrors = {};
    
    if (!formData.finderName) newErrors.finderName = true;
    if (!formData.finderGrade) newErrors.finderGrade = true;
    if (!formData.finderId) newErrors.finderId = true;
    if (formData.category === 'Item') newErrors.category = true;
    if (!formData.date) newErrors.date = true;
    if (formData.location === 'Location') newErrors.location = true;
    if (formData.location === 'Others:' && !formData.customLocation) newErrors.customLocation = true;
    if (!formData.description) newErrors.description = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setIsSubmitting(false);
      return;
    }
    
    const valuableCategories = [
      'Gadgets / Electronics',
      'Money and Payment Items', 
      'Identification and Wallets',
      'Bags and Storage',
      'Jewelry / Valuables'
    ];
    
    const submitData = {
      ...formData,
      location: formData.location === 'Others:' ? formData.customLocation : formData.location,
      image: valuableCategories.includes(formData.category) ? '' : formData.image,
      officer: userName
    };
    console.log('Submitting formData:', submitData);
    console.log('Image data length:', formData.image ? formData.image.length : 'No image');
    
    try {
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasData = formData.finderName || formData.finderGrade || formData.finderId || 
                   formData.category !== 'Item' || formData.date || 
                   formData.location !== 'Location' || formData.description;
    
    if (hasData) {
      setShowCancelModal(true);
    } else {
      onNavigate('dashboard');
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    onNavigate('dashboard');
  };

  return (
    <div className="hand-over-screen">
      {/* <h1 className="hand-over-title">HAND OVER FORM</h1> */}
      <div className="hand-over-form-container">
        <form className="hand-over-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="form-section-title">
              <label>Finder's Information <span className="tagalog-hint">(Detalye ng nakakita)</span></label>
            </div>
            <div className="on-duty-label">
              <label>ON DUTY: {userName}</label>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-field">
              <label>Finder's Name <span className="tagalog-hint">(Pangalan ng nakakita)</span> <span className="required">*</span></label>
              <input 
                type="text" 
                name="finderName" 
                placeholder="Enter your name" 
                className={`form-input ${errors.finderName ? 'error' : ''}`}
                value={formData.finderName}
                onChange={(e) => updateFormData('finderName', e.target.value)}
              />
            </div>
            
            <div className="form-field">
              <label>Finder's ID Number <span className="tagalog-hint">(ID Number ng nakakita)</span> <span className="required">*</span></label>
              <input 
                type="text" 
                name="finderId" 
                placeholder="Enter your ID" 
                className={`form-input ${errors.finderId ? 'error' : ''}`}
                value={formData.finderId}
                onChange={(e) => updateFormData('finderId', e.target.value)}
              />
            </div>
            
            <div className="form-field">
              <label>Grade Section/ Course/ Role <span className="tagalog-hint">(Baitang - Seksyon/ Kurso/ Katungkulan)</span> <span className="required">*</span></label>
              <input 
                type="text" 
                name="finderGrade" 
                placeholder="Enter your grade/course" 
                className={`form-input ${errors.finderGrade ? 'error' : ''}`}
                value={formData.finderGrade}
                onChange={(e) => updateFormData('finderGrade', e.target.value)}
              />
            </div>
            
            <div className="form-field">
              <label>Item Category <span className="tagalog-hint">(Kategorya ng Item)</span> <span className="required">*</span></label>
              <div className="dropdown-container" onMouseLeave={() => setDropdowns(prev => ({ ...prev, category: false }))}>
                <div 
                  className={`dropdown-placeholder ${formData.category !== 'Item' ? 'has-value' : ''} ${errors.category ? 'error' : ''}`}
                  onClick={() => toggleDropdown('category')}
                >
                  {formData.category} &#9662;
                </div>
                {dropdowns.category && (
                  <div className="dropdown-menu">
                    {[
                      'Personal Belongings',
                      'School Supplies',
                      'Clothing',
                      'Accessories',
                      'Miscellaneous / Others',
                      'Documents / Identification',
                      'Gadgets / Electronics',
                      'Money and Payment Items',
                      'Identification and Wallets',
                      'Bags and Storage',
                      'Jewelry / Valuables'
                    ].map(category => (
                      <div key={category} className="dropdown-item" onClick={() => {
                        updateFormData('category', category);
                        toggleDropdown('category');
                      }}>
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-field">
              <label>Description <span className="tagalog-hint">(Ilarawan o i-describe ang Item)</span> <span className="required">*</span></label>
              <textarea 
                name="description" 
                placeholder="Please provide a description of the item" 
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-field">
              <label>Item Photo <span className="tagalog-hint">(Larawan ng Item)</span></label>
              <div className="image-capture-section">
                {['Gadgets / Electronics', 'Money and Payment Items', 'Identification and Wallets', 'Bags and Storage', 'Jewelry / Valuables'].includes(formData.category) ? (
                  <div className="photo-disabled-note">
                    <p>Note: Photo not allowed for valuable items.</p>
                  </div>
                ) : capturedImage ? (
                  <div className="captured-image-preview">
                    <img src={capturedImage} alt="Captured item" className="preview-image" />
                    <button type="button" className="retake-photo-btn" onClick={() => setShowCamera(true)}>
                      📷 Retake Photo
                    </button>
                  </div>
                ) : (
                  <button type="button" className="take-photo-btn" onClick={() => setShowCamera(true)}>
                    📷 Take Photo
                  </button>
                )}
              </div>
            </div>
            
            <div className="form-field">
              <label>Location Found <span className="tagalog-hint">(Lokasyon kung saan nakita)</span> <span className="required">*</span></label>
              <div className="dropdown-container" onMouseLeave={() => setDropdowns(prev => ({ ...prev, location: false }))}>
                <div 
                  className={`dropdown-placeholder ${formData.location !== 'Location' ? 'has-value' : ''} ${errors.location ? 'error' : ''}`}
                  onClick={() => toggleDropdown('location')}
                >
                  {formData.location} &#9662;
                </div>
                {dropdowns.location && (
                  <div className="dropdown-menu scrollable">
                    {['Entrance Lobby', 'Lobby 2 (Lost and Found Location)', 'EFS 1st Floor', 'EFS 2nd Floor', 'EFS 3rd Floor', 'EFS 4th Floor', 'DSR 1st Floor', 'DSR 2nd Floor', 'DSR 3rd Floor', 'DSR 4th Floor', 'Others:'].map(location => (
                      <div key={location} className="dropdown-item" onClick={() => {
                        updateFormData('location', location);
                        if (location !== 'Others:') {
                          updateFormData('customLocation', '');
                        }
                        toggleDropdown('location');
                      }}>
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {formData.location === 'Others:' && (
                <input 
                  type="text" 
                  placeholder="Enter specific location" 
                  className={`form-input ${errors.customLocation ? 'error' : ''}`}
                  value={formData.customLocation}
                  onChange={(e) => updateFormData('customLocation', e.target.value)}
                  style={{marginTop: '0.5rem'}}
                />
              )}
            </div>
            
            <div className="form-field">
              <label>Date and Time <span className="tagalog-hint">(Petsa at Oras)</span> <span className="required">*</span></label>
              <input 
                type="datetime-local" 
                className={`form-input ${errors.date ? 'error' : ''}`}
                placeholder="Select date and time"
                min="2025-01-01T00:00"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
              />
            </div>
            

          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`submit-btn ${formData.finderName && formData.finderGrade && formData.finderId && formData.category !== 'Item' && formData.date && formData.description && !isSubmitting ? 'active' : ''}`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
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
      
      {showCamera && (
        <CameraCapture 
          onCapture={(image) => {
            console.log('Camera captured image:', image ? 'YES' : 'NO', image?.length);
            setCapturedImage(image);
            updateFormData('image', image);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
      
      {showCancelModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <p className="pin-modal-text">
              Are you sure you want to cancel?<br />
              All entered data will be lost.
            </p>
            <div className="pin-modal-buttons">
              <button className="pin-cancel-btn" onClick={() => setShowCancelModal(false)}>
                Stay
              </button>
              <button className="pin-confirm-btn" onClick={confirmCancel}>
                Cancel Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandOverForm;