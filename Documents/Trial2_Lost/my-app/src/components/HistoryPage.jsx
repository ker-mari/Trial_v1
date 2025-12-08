import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import './HistoryPage.css';

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

const HistoryPage = ({ historyItems }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateSort, setDateSort] = useState(null); // 'asc' or 'desc'
  const [codeFilter, setCodeFilter] = useState('all'); // 'all', 'V', 'L'
  const [clickingItem, setClickingItem] = useState(null);
  const [rejectionComments, setRejectionComments] = useState([]);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleCodeClick = () => {
    setCodeFilter(codeFilter === 'all' ? 'V' : codeFilter === 'V' ? 'L' : 'all');
  };
  
  const handleDateClick = () => {
    setDateSort(dateSort === null ? 'asc' : dateSort === 'asc' ? 'desc' : null);
  };
  
  // Backend already filters out unwanted statuses
  let filteredItems = historyItems || [];
  
  // Apply code filter
  if (codeFilter !== 'all') {
    filteredItems = filteredItems.filter(item => item.code === codeFilter);
  }
  
  // Apply date sorting (default to newest first)
  filteredItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date);
    const dateB = new Date(b.created_at || b.date);
    if (dateSort === 'asc') return dateA - dateB;
    if (dateSort === 'desc') return dateB - dateA;
    return dateB - dateA; // Default: newest first
  });

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };

    try {
      // Try to parse the date - could be from created_at or date field
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return { date: 'Invalid Date', time: 'N/A' };
      }

      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      return { date: 'Invalid Date', time: 'N/A' };
    }
  };

  return (
    <div className="screen-layout no-scroll">
      <div className="table-container history-table" data-rows={filteredItems.length}>

        <table className="data-table">
          <thead>
            <tr>
              <th 
                onClick={handleDateClick}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by date"
              >
                Date {dateSort === 'asc' ? '↑' : dateSort === 'desc' ? '↓' : '↕'}
              </th>
              <th>Time</th>
              <th 
                onClick={handleCodeClick}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to filter by code"
              >
                Code {codeFilter === 'all' ? '(All)' : codeFilter === 'V' ? '(V)' : '(L)'}
              </th>
              <th>Item Name</th>
              <th>Owner</th>
              <th style={{textAlign: 'center'}}>Status</th>
              <th>Officer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No history records found
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const { date, time } = formatDateTime(item.created_at || item.date);

                return (
                  <tr key={item.id || `history-${index}`} className={index % 2 === 1 ? "gray-row" : ""}>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>
                      <span className={`code-badge ${item.code === 'V' ? 'valuable' : 'lost'}`}>
                        {item.code || 'N/A'}
                      </span>
                    </td>
                    <td>{item.item_name || item.itemName || 'N/A'}</td>
                    <td>{item.owner || 'N/A'}</td>
                    <td style={{textAlign: 'center'}}>
                      <span className={`status-text ${
                        item.status === 'Claimed' || item.status === 'Edit Approved' ? 'status-claimed' :
                        item.status === 'Rejected' || item.status === 'Edit Rejected' ? 'status-rejected' :
                        item.status === 'Admin Edit'  ? 'status-admin-edit' : ''
                      }`}>
                        {item.status === 'Admin Edit' ? 'Admin Update' : item.status || 'N/A'}
                      </span>
                    </td>
                    <td>{item.officer || 'N/A'}</td>
                    <td>
                      <button 
                        className="view-details-btn"
                        disabled={clickingItem === item.id}
                        onClick={async () => {
                          if (clickingItem) return;
                          setClickingItem(item.id);
                          setSelectedItem(item);
                          
                          // Fetch rejection comments for any item
                          const itemId = item.item_id || item.id;
                          if (itemId) {
                            try {
                              const response = await itemsAPI.getRejectionComments(itemId);
                              console.log('Rejection comments response:', response.data);
                              setRejectionComments(response.data || []);
                            } catch (error) {
                              console.error('Failed to fetch rejection comments:', error);
                              setRejectionComments([]);
                            }
                          } else {
                            setRejectionComments([]);
                          }
                          
                          setTimeout(() => setClickingItem(null), 500);
                        }}
                      >
                        {clickingItem === item.id ? 'Loading...' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {selectedItem && (
        <div className="history-modal-overlay">
          <div className="history-modal-content">
            <button className="history-modal-close-btn" onClick={() => setSelectedItem(null)}>
              ✕
            </button>
            <h2 className="history-modal-title">Item's Information</h2>
            <div className="history-modal-body">
              <div className="history-modal-image-container">
                <div className="history-modal-image-placeholder">
                  {selectedItem.image && (selectedItem.image.startsWith('http') || selectedItem.image.startsWith('data:image/')) ? (
                    <img src={selectedItem.image} alt="Item" style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px'}} />
                  ) : (
                    categoryEmojis[selectedItem.category]?.startsWith('http') ? (
                      <img src={categoryEmojis[selectedItem.category]} alt={selectedItem.category} style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'contain'}} />
                    ) : (
                      <div style={{fontSize: '4rem'}}>{categoryEmojis[selectedItem.category] || '📦'}</div>
                    )
                  )}
                </div>
              </div>
              <div className="history-modal-details-container">
                <h3>Item no.: {selectedItem.item_no || selectedItem.id || 'N/A'}</h3>
                <p className="history-modal-category">{selectedItem.category || selectedItem.item_name || selectedItem.itemName || 'N/A'}</p>
                <p className="history-modal-info-label">Location Found</p>
                <p className="history-modal-info-value">{selectedItem.location || 'N/A'}</p>
                <p className="history-modal-info-label">Date and Time <span className="tagalog-hint">(Araw at oras nong nakita)</span></p>
                <p className="history-modal-info-value">
                  {selectedItem.date_time || selectedItem.created_at || selectedItem.date
                    ? new Date(selectedItem.date_time || selectedItem.created_at || selectedItem.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Date not available'
                  }
                </p>
                <hr className="history-modal-divider" />
                <p className="history-modal-info-label">Description</p>
                <p className="history-modal-info-value">{selectedItem.description || 'N/A'}</p>
                {/* Always show rejection comments section for debugging */}
                <p className="history-modal-info-label" style={{marginTop: '1rem', color: '#e74c3c'}}>
                  Admin Comments ({rejectionComments.length} found)
                </p>
                {rejectionComments.length > 0 ? (
                  rejectionComments.map((comment, index) => (
                    <div key={index} style={{
                      padding: '0.75rem',
                      background: '#fff5f5',
                      border: '1px solid #ffcccc',
                      borderRadius: '6px',
                      color: '#c0392b',
                      fontStyle: 'italic',
                      marginBottom: '0.5rem'
                    }}>
                      <p style={{margin: 0, marginBottom: '0.25rem'}}>
                        <strong>Reason:</strong> {comment.rejection_reason || 'No reason provided'}
                      </p>
                      <p style={{margin: 0, fontSize: '0.85em', opacity: 0.8}}>
                        By: {comment.user_name} • {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{color: '#666', fontStyle: 'italic'}}>No admin comments available</p>
                )}
                <hr className="history-modal-divider" />
                <div className="history-two-column-info">
                  <div className="history-info-column">
                    <p className="history-modal-info-label">Finder's Information <span className="tagalog-hint">(Detalye ng nakakita)</span></p>
                    <div className="history-info-item">
                      <strong>Name:</strong> {selectedItem.finder_name || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>Grade/Course:</strong> {selectedItem.finder_grade || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>ID Number:</strong> {selectedItem.finder_id || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>Officer on Duty:</strong> {selectedItem.officer || 'N/A'}
                    </div>
                  </div>
                  <div className="history-info-column">
                    <p className="history-modal-info-label">Claimer's Information <span className="tagalog-hint">(Detalye ng nag-claim)</span></p>
                    <div className="history-info-item">
                      <strong>Name:</strong> {selectedItem.owner || selectedItem.claimer_name || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>Grade/Course:</strong> {selectedItem.claimer_grade || selectedItem.owner_grade || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>ID Number:</strong> {selectedItem.claimer_id || selectedItem.owner_id || 'N/A'}
                    </div>
                    <div className="history-info-item">
                      <strong>Status:</strong> 
                      <span className={`history-status-badge ${
                        selectedItem.status === 'Claimed' || selectedItem.status === 'Edit Approved' ? 'claimed' :
                        selectedItem.status === 'Rejected' || selectedItem.status === 'Edit Rejected' ? 'rejected' :
                        selectedItem.status === 'Admin Edit' ? 'admin-edit' : 'default'
                      }`}>
                        {selectedItem.status === 'Admin Edit' ? 'Admin Update' : selectedItem.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;