import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import './ItemsToBeCleared.css';

const ItemsToBeCleared = () => {
  const [items, setItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemsToBeCleared();
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
          itemName: item.category,
          description: item.description || 'No description available',
          daysPassed: `${daysPassed} days`,
          officer: 'Officer'
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

  const handleClearItem = async (itemId) => {
    const row = event.target.closest('tr');
    row.innerHTML = '<td colspan="6" style="text-align: center; padding: 1rem; color: #666;">Clearing...</td>';
    
    setTimeout(async () => {
      try {
        await itemsAPI.delete(itemId);
        setItems(items.filter(item => item.id !== itemId));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error clearing item:', error);
        }
      }
    }, 1000);
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(items.map(item => itemsAPI.delete(item.id)));
      setItems([]);
      setShowConfirmModal(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error clearing all items:', error);
      }
    }
  };

  return (
    <div className="screen-layout">
      <div className="items-header">
        <button onClick={() => setShowConfirmModal(true)} className="clear-all-btn" disabled={items.length === 0}>
          Clear all
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date (Handed Over)</th>
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
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 1 ? "gray-row" : ""}>
                  <td>{item.date}</td>
                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{item.daysPassed}</td>
                  <td>{item.officer}</td>
                  <td>
                    <button onClick={() => handleClearItem(item.id)} className="clear-item-btn">
                      Clear
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  List is currently empty.
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
    </div>
  );
};

export default ItemsToBeCleared;