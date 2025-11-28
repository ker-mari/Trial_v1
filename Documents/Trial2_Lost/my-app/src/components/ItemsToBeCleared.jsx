import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import './ItemsToBeCleared.css';

const ItemsToBeCleared = () => {
  const [items, setItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearItemModal, setShowClearItemModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dateSort, setDateSort] = useState(null);

  useEffect(() => {
    fetchItemsToBeCleared();
    document.body.style.overflow = 'hidden';
    
    // Listen for refresh events
    const handleRefresh = () => {
      fetchItemsToBeCleared();
    };
    
    window.addEventListener('refreshItemsToBeCleared', handleRefresh);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('refreshItemsToBeCleared', handleRefresh);
    };
  }, []);

  const fetchItemsToBeCleared = async () => {
    try {
      const response = await itemsAPI.getItemsToBeCleared();
      const itemsData = response.data.data || response.data;
      
      const formattedItems = itemsData.map(item => {
        const itemDate = new Date(item.date_time || item.created_at);
        const daysPassed = Math.floor((new Date() - itemDate) / (1000 * 60 * 60 * 24));
        
        return {
          id: item.id,
          date: itemDate.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }),
          rawDate: itemDate,
          itemName: item.category,
          description: item.description || 'No description available',
          daysPassed: `${daysPassed} days`,
          officer: 'Officer',
          code: item.is_valuable ? 'V' : 'L'
        };
      });
      
      setItems(formattedItems);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching items to be cleared:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearItemClick = (itemId) => {
    setItemToDelete(itemId);
    setShowClearItemModal(true);
  };

  const handleClearItem = async () => {
    if (!itemToDelete) return;

    try {
      await itemsAPI.delete(itemToDelete);
      setItems(items.filter(item => item.id !== itemToDelete));
      setShowClearItemModal(false);
      setItemToDelete(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error clearing item:', error);
      }
      setShowClearItemModal(false);
      setItemToDelete(null);
    }
  };

  const handleClearAll = async () => {
    setShowConfirmModal(false);
    setClearing(true);

    try {
      await Promise.all(items.map(item => itemsAPI.delete(item.id)));
      setItems([]);
      setClearing(false);
      setShowSuccessModal(true);

      // Auto-hide success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error clearing all items:', error);
      }
      setClearing(false);
      alert('Error clearing items. Please try again.');
    }
  };

  // Apply date sorting
  let displayItems = [...items];
  if (dateSort) {
    displayItems = displayItems.sort((a, b) => {
      return dateSort === 'asc' ? a.rawDate - b.rawDate : b.rawDate - a.rawDate;
    });
  }

  return (
    <div className="screen-layout no-scroll">
      <div className="items-header">
        <button onClick={() => setShowConfirmModal(true)} className="clear-all-btn" disabled={items.length === 0}>
          Clear all
        </button>
      </div>
      <div className="table-container" data-rows={displayItems.length}>

        <table className="data-table">
          <thead>
            <tr>
              <th 
                onClick={() => setDateSort(dateSort === null ? 'asc' : dateSort === 'asc' ? 'desc' : null)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by date"
              >
                Date (Handed Over) {dateSort === 'asc' ? '↑' : dateSort === 'desc' ? '↓' : '↕'}
              </th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Days Passed</th>
              <th>Officer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem' }}>
                  Loading...
                </td>
              </tr>
            ) : displayItems.length > 0 ? (
              displayItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 1 ? "gray-row" : ""}>
                  <td>{item.date}</td>

                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{item.daysPassed}</td>
                  <td>{item.officer}</td>
                  <td>
                    <button onClick={() => handleClearItemClick(item.id)} className="clear-item-btn">
                      Clear
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {items.length === 0 ? 'List is currently empty.' : 'No items match the current filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showConfirmModal && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out'}}>
            <p className="pin-modal-text">
              Are you sure you want to clear all items? <br />
              this action cannot be undone.
            </p>
            <div className="pin-modal-buttons">
              <button className="pin-cancel-btn" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="pin-confirm-btn" onClick={handleClearAll}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearItemModal && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out'}}>
            <p className="pin-modal-text">
              Are you sure you want to clear this item? <br />
              this action cannot be undone.
            </p>
            <div className="pin-modal-buttons">
              <button className="pin-cancel-btn" onClick={() => {
                setShowClearItemModal(false);
                setItemToDelete(null);
              }}>
                Cancel
              </button>
              <button className="pin-confirm-btn" onClick={handleClearItem}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {clearing && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out'}}>
            <div style={{textAlign: 'center', padding: '1rem'}}>
              <div className="spinner" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p className="pin-modal-text" style={{marginBottom: '0'}}>
                Clearing all items...
              </p>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="pin-modal-overlay" style={{animation: 'modalOverlayFadeIn 0.3s ease-out'}}>
          <div className="pin-modal" style={{animation: 'modalFadeIn 0.3s ease-out'}}>
            <div style={{textAlign: 'center', padding: '1rem'}}>
              <div style={{
                fontSize: '3rem',
                color: '#27ae60',
                marginBottom: '1rem'
              }}>✓</div>
              <p className="pin-modal-text" style={{
                marginBottom: '0',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                All items cleared successfully!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsToBeCleared;