import React, { useState } from 'react';

const HandOverForm = ({ userName, onSubmit, onNavigate }) => {
  const [formData, setFormData] = useState({
    category: 'Item',
    date: '',
    location: 'Location',
    description: '',
    finderName: '',
    finderGrade: '',
    finderId: ''
  });
  const [dropdowns, setDropdowns] = useState({
    category: false,
    location: false
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.finderName || !formData.finderGrade || !formData.finderId || 
        formData.category === 'Item' || !formData.date || 
        formData.location === 'Location' || !formData.description) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="hand-over-screen">
      <h1 className="hand-over-title">HAND OVER FORM</h1>
      <div className="hand-over-form-container">
        <form className="hand-over-form" onSubmit={handleSubmit}>
          <div className="form-section top-section">
            <div className="form-group finders-info">
              <label>Finder's Information <span className="tagalog-hint">(Detalye ng nakakita)</span></label>
              <input 
                type="text" 
                name="finderName" 
                placeholder="Student's Name (Pangalan)" 
                className="form-input"
                value={formData.finderName}
                onChange={(e) => updateFormData('finderName', e.target.value)}
              />
              <input 
                type="text" 
                name="finderGrade" 
                placeholder="Grade/Course (Baitang)" 
                className="form-input"
                value={formData.finderGrade}
                onChange={(e) => updateFormData('finderGrade', e.target.value)}
              />
            </div>
            <div className="form-group on-duty-info">
              <label>ON DUTY: "{userName}"</label>
              <input 
                type="text" 
                name="finderId" 
                placeholder="Student's ID" 
                className="form-input"
                value={formData.finderId}
                onChange={(e) => updateFormData('finderId', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-section dropdown-section">
            <div className="dropdown-container">
              <div 
                className="dropdown-placeholder" 
                onClick={() => toggleDropdown('category')}
              >
                {formData.category} &#9662;
              </div>
              {dropdowns.category && (
                <div className="dropdown-menu">
                  {['Personal Belongings', 'School Supplies', 'Sports Equipments', 'Clothing', 'Accessories', 'Food and Drinks', 'Electronics'].map(category => (
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
            <div className="dropdown-container">
              <input 
                type="date" 
                className="dropdown-placeholder" 
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
              />
            </div>
            <div className="dropdown-container">
              <div 
                className="dropdown-placeholder" 
                onClick={() => toggleDropdown('location')}
              >
                {formData.location} &#9662;
              </div>
              {dropdowns.location && (
                <div className="dropdown-menu scrollable">
                  {['Entrance Lobby', 'Lobby 2 (Lost and Found Location)', 'EFS 1st Floor', 'EFS 2nd Floor', 'EFS 3rd Floor', 'EFS 4th Floor', 'DSR 1st Floor', 'DSR 2nd Floor'].map(location => (
                    <div key={location} className="dropdown-item" onClick={() => {
                      updateFormData('location', location);
                      toggleDropdown('location');
                    }}>
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                name="description" 
                placeholder="Input Text Here" 
                className="form-textarea"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandOverForm;