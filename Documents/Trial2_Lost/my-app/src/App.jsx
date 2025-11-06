import React, { useState, useEffect } from "react";
import "./App.css";
import ErrorBoundary from './components/ErrorBoundary';
import StartScreen from './components/StartScreen';
import PinScreen from './components/PinScreen';
import Dashboard from './components/Dashboard';
import ViewItems from './components/ViewItems';
import HandOverForm from './components/HandOverForm';
import HistoryPage from './components/HistoryPage';
import ApprovalQueues from './components/ApprovalQueues';
import AdminDashboard from './components/AdminDashboard';
import ItemsToBeCleared from './components/ItemsToBeCleared';
import ClaimForm from './components/ClaimForm';
import MainHeader from './components/Header';
import { ItemDetailsModal, ClaimFormModal, EditFormModal, SuccessModal } from './components/Modals';

function App() {
  const [screen, setScreen] = useState(() => {
    sessionStorage.removeItem('authenticated');
    window.history.pushState({}, '', '/');
    return 'start';
  });

  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isHandOverSuccessModalOpen, setIsHandOverSuccessModalOpen] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState('');

  const SESSION_TIMEOUT = 30 * 1000; // 30 seconds

  // Restore admin header and auth token on page load
  useEffect(() => {
    const restoreAuthState = async () => {
      const storedIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
      const storedAuthToken = sessionStorage.getItem('authToken');

      if (storedIsAdmin) {
        const { setAdminHeader } = await import('./services/api.js');
        setAdminHeader(true);
        setIsAdmin(true);
      }

      // Auth token is automatically restored in api.js
      // Just verify it exists
      if (!storedAuthToken && sessionStorage.getItem('authenticated')) {
        // Session exists but no token - force re-login
        sessionStorage.removeItem('authenticated');
        setScreen('start');
      }
    };
    restoreAuthState();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('authenticated')) {
      if (screen === 'dashboard' || screen === 'viewItems') {
        loadItemsFromDatabase();
      } else if (screen === 'history') {
        loadHistoryFromDatabase();
      }
    }
  }, [screen]);

  useEffect(() => {
    const checkTimeout = () => {
      if (sessionStorage.getItem('authenticated') && Date.now() - lastActivity > SESSION_TIMEOUT) {
        sessionStorage.removeItem('authenticated');
        setScreen('start');
        window.history.pushState({}, '', '/');
      }
    };
    const interval = setInterval(checkTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity]);

  useEffect(() => {
    const handleActivity = () => {
      if (sessionStorage.getItem('authenticated')) {
        setLastActivity(Date.now());
      }
    };
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(e => document.addEventListener(e, handleActivity, true));
    return () => events.forEach(e => document.removeEventListener(e, handleActivity, true));
  }, []);

  const loadItemsFromDatabase = async () => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      const response = await itemsAPI.getAll();

      const itemsData = response.data?.data || response.data || [];
      setItems(itemsData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading items:', error);
      }
      setItems([]);
    }
  };

  const loadHistoryFromDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history', {
        headers: {
          'X-Auth-Token': sessionStorage.getItem('authToken'),
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistoryItems(data.data || []);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to load history:', response.status, response.statusText);
        }
        setHistoryItems([]);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading history:', error);
      }
      setHistoryItems([]);
    }
  };

  const navigateToScreen = (screenName, item = null) => {
    if (item) setSelectedItem(item);
    setIsTransitioning(true);
    setTimeout(() => {
      const routes = { dashboard: '/dashboard', viewItems: '/view-items', handOver: '/hand-over', history: '/history', approvalQueues: '/approval-queues', itemsToBeCleared: '/items-to-be-cleared', claimForm: '/claim-form', pin: '/pin' };
      window.history.pushState({}, '', routes[screenName] || '/');
      setScreen(screenName);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePinSubmit = async (name, adminStatus = false, authToken = null) => {
    setUserName(name);
    setIsAdmin(adminStatus);
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('isAdmin', adminStatus.toString());
    setLastActivity(Date.now());

    // Set auth token and admin header for API requests
    const { setAuthToken, setAdminHeader } = await import('./services/api.js');
    if (authToken) {
      setAuthToken(authToken);
    }
    setAdminHeader(adminStatus);

    navigateToScreen('dashboard');
  };

  const handleHandOverSubmit = async (formData) => {
    try {
      const { itemsAPI } = await import('./services/api.js');

      // Format date to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
      let formattedDateTime = null;
      if (formData.date) {
        const date = new Date(formData.date);
        formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
      }

      const valuableCategories = [
        'Gadgets / Electronics',
        'Money and Payment Items', 
        'Identification and Wallets',
        'Bags and Storage',
        'Jewelry / Valuables'
      ];

      const itemData = {
        category: formData.category,
        location: formData.location,
        date_time: formattedDateTime,
        description: formData.description,
        is_valuable: valuableCategories.includes(formData.category),
        image: formData.image,
        finder_name: formData.finderName,
        finder_grade: formData.finderGrade,
        finder_id: formData.finderId,
        officer: userName
      };

      const response = await itemsAPI.create(itemData);
      
      if (response.data.success) {
        // Update local state with the new item from database
        setItems(prev => [...prev, response.data.data]);
        

        
        setIsHandOverSuccessModalOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to save item');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving item:', error);
        console.error('Error response:', error.response?.data);
      }
      const errorMessage = error.response?.data?.message || error.message;
      alert('Error saving item: ' + errorMessage);
    }
  };

  const handleClaimSubmit = async (claimFormData) => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      const response = await itemsAPI.claim(selectedItem.id, { owner: claimFormData.ownerName });
      
      if (response.data.success) {
        // Update local state to remove claimed item
        setItems(prev => prev.filter(item => item.id !== selectedItem.id));
        

        
        setSelectedItem(null);
        setIsSuccessModalOpen(true);
        navigateToScreen('viewItems');
      } else {
        throw new Error(response.data.message || 'Failed to claim item');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error claiming item:', error);
      }
      alert('Error claiming item: ' + error.message);
    }
  };

  const handleEditSubmit = async (editFormData) => {
    // Format date to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    let formattedDateTime = null;
    if (editFormData.date) {
      const date = new Date(editFormData.date);
      formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const updateData = {
      category: editFormData.category,
      location: editFormData.location,
      date_time: formattedDateTime,
      description: editFormData.description
    };

    try {

      if (isAdmin) {
        // Admin can update directly - include auth_is_admin in the request body
        const { itemsAPI } = await import('./services/api.js');
        const response = await itemsAPI.update(selectedItem.id, { ...updateData, auth_is_admin: true });

        if (response.data.success) {
          // Reload items from database to ensure UI is in sync
          await loadItemsFromDatabase();

          setIsEditFormOpen(false);
          setSelectedItem(null);

          // Show success modal
          setEditSuccessMessage('Item updated successfully!');
          setShowEditSuccessModal(true);
        } else {
          throw new Error(response.data.message || 'Failed to update item');
        }
      } else {
        // Guard creates pending edit
        const { approvalAPI } = await import('./services/api.js');

        // Only include allowed fields in original_data and new_data
        const allowedFields = ['category', 'location', 'description', 'date_time', 'is_valuable', 'image', 'status'];
        const originalData = {};
        const newData = {};

        allowedFields.forEach(field => {
          if (selectedItem[field] !== undefined) {
            originalData[field] = selectedItem[field];
          }
          if (updateData[field] !== undefined) {
            newData[field] = updateData[field];
          } else if (selectedItem[field] !== undefined) {
            newData[field] = selectedItem[field];
          }
        });

        const pendingEditData = {
          item_id: selectedItem.id,
          user_name: userName,
          edit_type: 'update',
          original_data: originalData,
          new_data: newData
        };

        const response = await approvalAPI.createPendingEdit(pendingEditData);

        if (response.data.success) {
          setIsEditFormOpen(false);
          setSelectedItem(null);

          // Show success modal
          setEditSuccessMessage('Changes Sent!\nYour edits have been submitted for admin approval.');
          setShowEditSuccessModal(true);
        } else {
          throw new Error(response.data.message || 'Failed to submit edit');
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting edit:', error);
        console.error('Error response:', error.response?.data);
        console.error('Update data sent:', updateData);
      }

      // Show error in modal with more details
      const errorMessage = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        console.error('Validation errors:', validationErrors);
        setEditSuccessMessage('Validation Error: ' + Object.values(validationErrors).flat().join(', '));
      } else {
        setEditSuccessMessage('Error: ' + errorMessage);
      }

      setShowEditSuccessModal(true);

      setTimeout(() => {
        setShowEditSuccessModal(false);
      }, 3000);
    }
  };

  const handleViewDetails = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };
  const handleClaimClick = () => { setIsModalOpen(false); navigateToScreen('claimForm', selectedItem); };

  const handleEditClick = () => { setIsModalOpen(false); setIsEditFormOpen(true); };
  const handleCloseEditForm = () => { setIsEditFormOpen(false); setSelectedItem(null); };
  const handleCloseSuccessModal = () => { setIsSuccessModalOpen(false); setSelectedItem(null); };
  const handleCloseHandOverSuccessModal = () => { setIsHandOverSuccessModalOpen(false); navigateToScreen('dashboard'); };

  return (
    <ErrorBoundary>
      <div className="app">
        <MainHeader screen={screen} onDashboard={() => navigateToScreen('dashboard')} />

        <div className={`screen-container ${isTransitioning ? 'transitioning' : ''}`}>
          {screen === "start" && <StartScreen onGetStarted={() => navigateToScreen('pin')} />}
          {screen === "pin" && <PinScreen onPinSubmit={handlePinSubmit} />}
          {screen === "dashboard" && (
            isAdmin ?
              <AdminDashboard userName={userName} itemsCount={items.length} onNavigate={navigateToScreen} /> :
              <Dashboard userName={userName} itemsCount={items.length} onNavigate={navigateToScreen} />
          )}
          {screen === "viewItems" && <ViewItems items={items} onViewDetails={handleViewDetails} />}
          {screen === "handOver" && <HandOverForm userName={userName} onSubmit={handleHandOverSubmit} onNavigate={navigateToScreen} />}
          {screen === "claimForm" && <ClaimForm userName={userName} selectedItem={selectedItem} onSubmit={handleClaimSubmit} onBack={() => navigateToScreen('viewItems')} />}
          {screen === "history" && <HistoryPage historyItems={historyItems} />}
          {screen === "approvalQueues" && <ApprovalQueues onBack={() => navigateToScreen('dashboard')} />}
          {screen === "itemsToBeCleared" && <ItemsToBeCleared />}
        </div>

        {isModalOpen && <ItemDetailsModal selectedItem={selectedItem} onClose={handleCloseModal} onClaim={handleClaimClick} onEdit={handleEditClick} />}
        {isEditFormOpen && <EditFormModal selectedItem={selectedItem} userName={userName} onClose={handleCloseEditForm} onSubmit={handleEditSubmit} />}
        {isSuccessModalOpen && <SuccessModal onClose={handleCloseSuccessModal} onViewHistory={() => { handleCloseSuccessModal(); navigateToScreen('history'); }} />}
        {isHandOverSuccessModalOpen && (
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
                  onClick={handleCloseHandOverSuccessModal}
                  style={{minWidth: '120px'}}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditSuccessModal && (
          <div className="modal-overlay">
            <div className="approval-success-modal">
              <div className="success-content">
                <div className="success-icon">✓</div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {editSuccessMessage.includes('successfully') ? 'Changes Saved!' : 'Changes Sent!'}
                  </h2>
                  <p className="success-message">
                    {editSuccessMessage.includes('successfully') ? 'Item has been updated successfully.' : 'Your edits have been submitted for admin approval.'}
                  </p>
                </div>
                <button 
                  className="modal-action-btn claim-btn"
                  onClick={() => setShowEditSuccessModal(false)}
                  style={{ marginTop: '1rem' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
