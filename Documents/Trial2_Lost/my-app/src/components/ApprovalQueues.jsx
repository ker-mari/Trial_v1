import React, { useState, useEffect } from 'react';
import { approvalAPI } from '../services/api';

const ApprovalQueues = () => {
  const [pendingEdits, setPendingEdits] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState(''); // 'approved' or 'rejected'
  const [dateSort, setDateSort] = useState(null);
  const [codeFilter, setCodeFilter] = useState('all');
  
  const handleDateClick = () => {
    setDateSort(dateSort === null ? 'asc' : dateSort === 'asc' ? 'desc' : null);
  };
  
  const handleCodeClick = () => {
    setCodeFilter(codeFilter === 'all' ? 'V' : codeFilter === 'V' ? 'L' : 'all');
  };
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  useEffect(() => {
    fetchPendingEdits();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const fetchPendingEdits = async () => {
    try {
      const response = await approvalAPI.getPendingEdits();
      setPendingEdits(response.data);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching pending edits:', error);
      }
      setPendingEdits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (edit) => {
    setSelectedEdit(edit);
  };

  const handleApprove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (processing) return;

    setProcessing(true);
    try {
      await approvalAPI.approve(id);

      // Log to history
      const historyEntry = {
        date: new Date().toISOString(),
        code: selectedEdit.new_data?.is_valuable || selectedEdit.original_data?.is_valuable ? 'V' : 'L',
        itemName: selectedEdit.new_data?.category || selectedEdit.original_data?.category,
        owner: selectedEdit.user_name,
        status: 'Approved',
        adminApproval: 'Approved',
        officer: 'Admin'
      };

      const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]');
      localStorage.setItem('localHistory', JSON.stringify([historyEntry, ...localHistory]));

      // Show success modal
      setSuccessType('approved');
      setSuccessMessage('Edit has been approved successfully!');
      setShowSuccessModal(true);

      fetchPendingEdits();
      setSelectedEdit(null);

      // Auto-hide modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error approving edit:', error);
      }
      alert('Error approving edit: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (processing) return;

    setProcessing(true);
    try {
      await approvalAPI.reject(selectedEdit.id, { comment: rejectComment });

      // Log to history
      const historyEntry = {
        date: new Date().toISOString(),
        code: selectedEdit.new_data?.is_valuable || selectedEdit.original_data?.is_valuable ? 'V' : 'L',
        itemName: selectedEdit.new_data?.category || selectedEdit.original_data?.category,
        owner: selectedEdit.user_name,
        status: 'Rejected',
        adminApproval: 'Rejected',
        officer: 'Admin',
        comment: rejectComment
      };

      const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]');
      localStorage.setItem('localHistory', JSON.stringify([historyEntry, ...localHistory]));

      // Show success modal
      setSuccessType('rejected');
      setSuccessMessage('Edit has been rejected successfully!');
      setShowSuccessModal(true);

      fetchPendingEdits();
      setSelectedEdit(null);
      setShowRejectModal(false);
      setRejectComment('');

      // Auto-hide modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error rejecting edit:', error);
      }
      alert('Error rejecting edit: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="screen-layout no-scroll">
      <div className="table-container approval-table" data-rows={pendingEdits.length}>
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
                <th>Status</th>
                <th>Officer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '3rem', fontSize: '1.1rem'}}>Loading...</td></tr>
              ) : (() => {
                // Apply filters and sorting
                let filteredEdits = [...pendingEdits];
                
                // Apply code filter
                if (codeFilter !== 'all') {
                  filteredEdits = filteredEdits.filter(edit => {
                    const isValuable = edit.new_data?.is_valuable || edit.original_data?.is_valuable;
                    return codeFilter === 'V' ? isValuable : !isValuable;
                  });
                }
                
                // Apply date sorting
                if (dateSort) {
                  filteredEdits = filteredEdits.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
                  });
                }
                
                return filteredEdits.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem', fontWeight: 'bold'}}>No pending approvals at the moment.</td></tr>
                ) : filteredEdits.map((edit, index) => (
                <tr key={edit.id} className={index % 2 === 1 ? "gray-row" : ""}>
                  <td>{new Date(edit.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</td>
                  <td>{new Date(edit.created_at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</td>
                  <td>
                    <span className={`code-badge ${edit.new_data?.is_valuable || edit.original_data?.is_valuable ? 'valuable' : 'lost'}`}>
                      {edit.new_data?.is_valuable || edit.original_data?.is_valuable ? 'V' : 'L'}
                    </span>
                  </td>
                  <td>{edit.new_data?.category || edit.original_data?.category}</td>
                  <td>
                    <span className="status-badge pending">Pending</span>
                  </td>
                  <td>{edit.user_name}</td>
                  <td>
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(edit)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ));
              })()}
            </tbody>
          </table>
        </div>

      {selectedEdit && (
        <div className="modal-overlay">
          <div className="approval-modal">
            <button
              className="modal-close-btn"
              onClick={() => setShowClearConfirmModal(true)}
            >
              ✕
            </button>
            <h3 className="approval-modal-title">Item's Information</h3>
            <div className="comparison-container">
              <div className="comparison-section old-section">
                <h4>OLD</h4>
                <div className="item-details">
                  <div className="detail-item">
                    <strong>Item no.:</strong> {selectedEdit.original_data?.item_no || 'N/A'}
                  </div>
                  <div className="detail-item category">
                    {selectedEdit.original_data?.category || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Location Found</strong>
                  </div>
                  <div className="detail-item location">
                    {selectedEdit.original_data?.location || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Date and Time</strong> <span className="tagalog">(Araw at oras nong nakita)</span>
                  </div>
                  <div className="detail-item date">
                    {selectedEdit.original_data?.date_time ? new Date(selectedEdit.original_data.date_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Description</strong>
                  </div>
                  <div className="detail-item description">
                    {selectedEdit.original_data?.description || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="comparison-section edited-section">
                <h4>EDITED</h4>
                <div className="item-details">
                  <div className="detail-item">
                    <strong>Item no.:</strong> {selectedEdit.new_data?.item_no || selectedEdit.original_data?.item_no || 'N/A'}
                  </div>
                  <div className={`detail-item category ${selectedEdit.new_data?.category !== selectedEdit.original_data?.category ? 'edited-text' : ''}`}>
                    {selectedEdit.new_data?.category || selectedEdit.original_data?.category || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Location Found</strong>
                  </div>
                  <div className={`detail-item location ${selectedEdit.new_data?.location !== selectedEdit.original_data?.location ? 'edited-text' : ''}`}>
                    {selectedEdit.new_data?.location || selectedEdit.original_data?.location || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Date and Time</strong> <span className="tagalog">(Araw at oras nong nakita)</span>
                  </div>
                  <div className={`detail-item date ${selectedEdit.new_data?.date_time && selectedEdit.new_data?.date_time !== selectedEdit.original_data?.date_time ? 'edited-text' : ''}`}>
                    {selectedEdit.new_data?.date_time ? new Date(selectedEdit.new_data.date_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (selectedEdit.original_data?.date_time ? new Date(selectedEdit.original_data.date_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A')}
                  </div>
                  <div className="detail-item">
                    <strong>Description</strong>
                  </div>
                  <div className={`detail-item description ${selectedEdit.new_data?.description !== selectedEdit.original_data?.description ? 'edited-text' : ''}`}>
                    {selectedEdit.new_data?.description || selectedEdit.original_data?.description || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="approval-modal-footer">
              <button
                className="approve-btn"
                onClick={(e) => handleApprove(e, selectedEdit.id)}
                disabled={processing}
              >
                ✓ Approve
              </button>
              <button
                className="reject-btn"
                onClick={handleRejectClick}
                disabled={processing}
              >
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out', maxWidth: '550px'}}>
            <h3 style={{color: '#2c3e50', marginBottom: '1rem', fontSize: '1.3rem'}}>Reject Edit</h3>
            <p className="pin-modal-text" style={{marginBottom: '1.5rem'}}>
              Please provide a reason for rejecting this edit (optional):
            </p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter your comment here..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '2px solid #ddd',
                fontSize: '1rem',
                fontFamily: '"Atkinson Hyperlegible", sans-serif',
                resize: 'vertical',
                marginBottom: '1.5rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#003b6f'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <div className="pin-modal-buttons">
              <button
                className="pin-cancel-btn"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment('');
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="pin-confirm-btn"
                onClick={handleRejectConfirm}
                disabled={processing}
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="approval-success-modal">
            <div className="success-content">
              <div className={`success-icon ${successType}`}>✓</div>
              <p className="success-message">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {showClearConfirmModal && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out'}}>
            <p className="pin-modal-text">
              Are you sure you want to close this review? <br />
              This item will remain in the approval queue.
            </p>
            <div className="pin-modal-buttons">
              <button className="pin-cancel-btn" onClick={() => setShowClearConfirmModal(false)}>
                Cancel
              </button>
              <button className="pin-confirm-btn" onClick={() => {
                setShowClearConfirmModal(false);
                setSelectedEdit(null);
              }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueues;