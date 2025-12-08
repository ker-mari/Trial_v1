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
import AppModals from './components/AppModals';

 

function App() {
  const [screen, setScreen] = useState(() => {
    // Check if user is authenticated
    if (sessionStorage.getItem('authenticated')) {
      // Determine screen based on current URL
      const path = window.location.pathname;
      if (path === '/dashboard') return 'dashboard';
      if (path === '/view-items') return 'viewItems';
      if (path === '/hand-over') return 'handOver';
      if (path === '/history') return 'history';
      if (path === '/approval-queues') return 'approvalQueues';
      if (path === '/items-to-be-cleared') return 'itemsToBeCleared';
      if (path === '/claim-form') return 'claimForm';
      if (path === '/pin') return 'pin';
      return 'dashboard'; // Default to dashboard if authenticated
    }
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

  const [isHandOverSuccessModalOpen, setIsHandOverSuccessModalOpen] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState('');



  // Restore admin header and auth token on page load
  useEffect(() => {
    const restoreAuthState = async () => {
      const storedIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
      const storedUserName = sessionStorage.getItem('userName');
      const storedAuthToken = sessionStorage.getItem('authToken');

      if (storedUserName) {
        setUserName(storedUserName);
      }

      if (storedIsAdmin) {
        const { setAdminHeader } = await import('./services/api.js');
        setAdminHeader(true);
        setIsAdmin(true);
      }

      // Auth token is automatically restored in api.js
    };
    restoreAuthState();

    // Listen for session expiry events
    const handleSessionExpired = () => {
      setUserName('');
      setIsAdmin(false);
      setItems([]);
      setHistoryItems([]);
      setSelectedItem(null);
      window.history.pushState({}, '', '/pin');
      setScreen('pin');
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    // Handle browser back/forward button
    const handlePopState = (event) => {
      const path = window.location.pathname;
      const pathToScreen = {
        '/': 'start',
        '/pin': 'pin',
        '/dashboard': 'dashboard',
        '/view-items': 'viewItems',
        '/hand-over': 'handOver',
        '/history': 'history',
        '/approval-queues': 'approvalQueues',
        '/items-to-be-cleared': 'itemsToBeCleared',
        '/claim-form': 'claimForm'
      };
      
      const newScreen = pathToScreen[path] || 'start';
      const adminOnlyScreens = ['approvalQueues', 'itemsToBeCleared'];
      const currentIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
      
      // Check admin access
      if (adminOnlyScreens.includes(newScreen) && !currentIsAdmin) {
        window.history.pushState({}, '', '/dashboard');
        setScreen('dashboard');
        return;
      }
      
      // Force screen update
      if (sessionStorage.getItem('authenticated') || ['start', 'pin'].includes(newScreen)) {
        setScreen(newScreen);
      } else {
        setScreen('pin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Trigger initial popstate to sync with current URL
    handlePopState();
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('popstate', handlePopState);
    };
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

  // Smart real-time updates with rate limiting handling
  useEffect(() => {
    if (!sessionStorage.getItem('authenticated')) return;
    
    let retryDelay = 15000; // Start with 15 seconds
    
    const updateWithRetry = async () => {
      try {
        if (screen === 'dashboard' || screen === 'viewItems') {
          await loadItemsFromDatabase();
        } else if (screen === 'history') {
          await loadHistoryFromDatabase();
        } else if (screen === 'approvalQueues') {
          window.dispatchEvent(new CustomEvent('refreshApprovalQueues'));
        } else if (screen === 'itemsToBeCleared') {
          window.dispatchEvent(new CustomEvent('refreshItemsToBeCleared'));
        }
        retryDelay = 15000; // Reset delay on success
      } catch (error) {
        if (error.response?.status === 429) {
          retryDelay = Math.min(retryDelay * 2, 60000); // Exponential backoff, max 60s
        }
      }
    };
    
    const interval = setInterval(updateWithRetry, retryDelay);
    
    return () => clearInterval(interval);
  }, [screen]);





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
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/history`, {
        headers: {
          'X-Auth-Token': sessionStorage.getItem('authToken'),
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const dbHistory = data.data || [];

        // Load localStorage history (contains approval/rejection comments)
        const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]')
          .filter(item => !['Approved', 'Rejected'].includes(item.status));

        // Merge both histories, with localStorage taking precedence for newer items
        const mergedHistory = [...localHistory, ...dbHistory];

        setHistoryItems(mergedHistory);
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
    const adminOnlyScreens = ['approvalQueues', 'itemsToBeCleared'];
    
    // Block regular users from admin screens
    if (adminOnlyScreens.includes(screenName) && !isAdmin) {
      return;
    }
    
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
    sessionStorage.setItem('userName', name);

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
      const claimData = {
        owner: claimFormData.ownerName,
        claimer_name: claimFormData.ownerName,
        claimer_grade: claimFormData.ownerGrade,
        claimer_id: claimFormData.ownerId,
        claim_date: claimFormData.claimDate
      };
      
      console.log('Claiming item with data:', claimData);
      console.log('Selected item ID:', selectedItem.id);
      
      const response = await itemsAPI.claim(selectedItem.id, claimData);
      
      if (response.data.success) {
        setItems(prev => prev.filter(item => item.id !== selectedItem.id));
        setSelectedItem(null);
        setIsSuccessModalOpen(true);
        navigateToScreen('viewItems');
      } else {
        throw new Error(response.data.message || 'Failed to claim item');
      }
    } catch (error) {
      console.error('Error claiming item:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert('Error claiming item: ' + (error.response?.data?.message || error.message));
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

      // Close the edit form modal
      setIsEditFormOpen(false);
      setSelectedItem(null);

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

  const handleLogout = async () => {
    try {
      const { authAPI } = await import('./services/api.js');
      await authAPI.logout();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout error:', error);
      }
    } finally {
      // Clear all session data
      sessionStorage.clear();
      setUserName('');
      setIsAdmin(false);
      setItems([]);
      setHistoryItems([]);
      setSelectedItem(null);
      
      // Clear API headers
      const { setAuthToken, setAdminHeader } = await import('./services/api.js');
      setAuthToken(null);
      setAdminHeader(false);
      
      // Navigate to start screen
      window.history.pushState({}, '', '/');
      setScreen('start');
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <MainHeader screen={screen} onDashboard={() => navigateToScreen('dashboard')} onLogout={handleLogout} />

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
        
        <AppModals 
          isHandOverSuccessModalOpen={isHandOverSuccessModalOpen}
          onCloseHandOverSuccessModal={handleCloseHandOverSuccessModal}
          showEditSuccessModal={showEditSuccessModal}
          editSuccessMessage={editSuccessMessage}
          onCloseEditSuccessModal={() => setShowEditSuccessModal(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
