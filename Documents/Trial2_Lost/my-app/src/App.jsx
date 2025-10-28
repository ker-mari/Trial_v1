import React, { useState, useEffect } from "react";
import "./App.css";
import "./history.css";
import StartScreen from './components/StartScreen';
import PinScreen from './components/PinScreen';
import Dashboard from './components/Dashboard';
import ViewItems from './components/ViewItems';
import HandOverForm from './components/HandOverForm';
import HistoryPage from './components/HistoryPage';
import MainHeader from './components/Header';
import { ItemDetailsModal, ClaimFormModal, EditFormModal, SuccessModal } from './components/Modals';

const SESSION_TIMEOUT = 30 * 1000;

function App() {
  const [screen, setScreen] = useState(() => {
    if (performance.navigation.type === 1) {
      window.history.pushState({}, '', '/');
      return 'start';
    }
    
    const path = window.location.pathname;
    const isAuth = sessionStorage.getItem('authenticated');
    
    if (!isAuth && ['/dashboard', '/view-items', '/hand-over', '/history'].includes(path)) {
      window.location.href = '/pin';
      return 'pin';
    }
    
    const routes = { '/pin': 'pin', '/dashboard': 'dashboard', '/view-items': 'viewItems', '/hand-over': 'handOver', '/history': 'history' };
    return routes[path] || 'start';
  });

  const [userName, setUserName] = useState("");
  const [items, setItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (sessionStorage.getItem('authenticated')) {
      if (screen === 'dashboard' || screen === 'viewItems') {
        loadItemsFromDatabase();
      }
      if (screen === 'history') {
        setHistoryItems(JSON.parse(localStorage.getItem('localHistory') || '[]'));
      }
    }
  }, [screen]);

  const loadItemsFromDatabase = async () => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      const response = await itemsAPI.getAll();
      
      if (response.data && response.data.data) {
        setItems(response.data.data);
      } else {
        console.warn('No items data received from API');
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading items from database:', error);
      setItems(JSON.parse(localStorage.getItem('localItems') || '[]'));
    }
  };

  useEffect(() => {
    const checkTimeout = () => {
      if (sessionStorage.getItem('authenticated') && Date.now() - lastActivity > SESSION_TIMEOUT) {
        sessionStorage.removeItem('authenticated');
        window.location.href = '/';
      }
    };
    const interval = setInterval(checkTimeout, 5000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  useEffect(() => {
    const handleActivity = () => sessionStorage.getItem('authenticated') && setLastActivity(Date.now());
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(e => document.addEventListener(e, handleActivity, true));
    return () => events.forEach(e => document.removeEventListener(e, handleActivity, true));
  }, []);

  const navigateToScreen = (screenName) => {
    const routes = { dashboard: '/dashboard', viewItems: '/view-items', handOver: '/hand-over', history: '/history', pin: '/pin' };
    window.history.pushState({}, '', routes[screenName] || '/');
    setScreen(screenName);
  };

  const handlePinSubmit = (name) => {
    setUserName(name);
    sessionStorage.setItem('authenticated', 'true');
    setLastActivity(Date.now());
    navigateToScreen('dashboard');
  };

  const handleHandOverSubmit = async (formData) => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      
      const itemData = {
        category: formData.category,
        location: formData.location,
        date_time: formData.date,
        description: formData.description,
        is_valuable: false
      };
      
      const response = await itemsAPI.create(itemData);
      
      if (response.data.success) {
        // Update local state with the new item from database
        setItems(prev => [...prev, response.data.data]);
        
        alert('Item has been handed over and saved to database!');
        navigateToScreen('dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item: ' + error.message);
    }
  };

  const handleClaimSubmit = async (claimFormData) => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      const response = await itemsAPI.claim(selectedItem.id);
      
      if (response.data.success) {
        // Update local state to remove claimed item
        setItems(prev => prev.filter(item => item.id !== selectedItem.id));
        
        // Add to history
        const historyEntry = {
          date: claimFormData.claimDate,
          code: selectedItem.is_valuable ? 'V' : 'L',
          itemName: selectedItem.category,
          owner: claimFormData.ownerName,
          status: 'Claimed',
          officer: userName
        };
        
        const localHistory = JSON.parse(localStorage.getItem('localHistory') || '[]');
        localStorage.setItem('localHistory', JSON.stringify([historyEntry, ...localHistory]));
        setHistoryItems(prev => [historyEntry, ...prev]);
        
        setIsClaimFormOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to claim item');
      }
    } catch (error) {
      console.error('Error claiming item:', error);
      alert('Error claiming item: ' + error.message);
    }
  };

  const handleEditSubmit = async (editFormData) => {
    try {
      const { itemsAPI } = await import('./services/api.js');
      
      const updateData = {
        category: editFormData.category,
        location: editFormData.location,
        date_time: editFormData.date,
        description: editFormData.description,
        is_valuable: editFormData.is_valuable
      };
      
      const response = await itemsAPI.update(selectedItem.id, updateData);
      
      if (response.data.success) {
        // Update local state with updated item
        setItems(prev => prev.map(item => 
          item.id === selectedItem.id ? { ...item, ...updateData } : item
        ));
        
        setIsEditFormOpen(false);
        setSelectedItem(null);
        alert('Item updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item: ' + error.message);
    }
  };

  const handleViewDetails = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };
  const handleClaimClick = () => { setIsModalOpen(false); setIsClaimFormOpen(true); };
  const handleCloseClaimForm = () => { setIsClaimFormOpen(false); setSelectedItem(null); };
  const handleEditClick = () => { setIsModalOpen(false); setIsEditFormOpen(true); };
  const handleCloseEditForm = () => { setIsEditFormOpen(false); setSelectedItem(null); };
  const handleCloseSuccessModal = () => { setIsSuccessModalOpen(false); setSelectedItem(null); };

  return (
    <div className="app">
      <MainHeader screen={screen} onDashboard={() => navigateToScreen('dashboard')} />
      
      {screen === "start" && <StartScreen onGetStarted={() => navigateToScreen('pin')} />}
      {screen === "pin" && <PinScreen onPinSubmit={handlePinSubmit} />}
      {screen === "dashboard" && <Dashboard userName={userName} itemsCount={items.length} onNavigate={navigateToScreen} />}
      {screen === "viewItems" && <ViewItems items={items} onViewDetails={handleViewDetails} />}
      {screen === "handOver" && <HandOverForm userName={userName} onSubmit={handleHandOverSubmit} />}
      {screen === "history" && <HistoryPage historyItems={historyItems} />}

      {isModalOpen && <ItemDetailsModal selectedItem={selectedItem} onClose={handleCloseModal} onClaim={handleClaimClick} onEdit={handleEditClick} />}
      {isClaimFormOpen && <ClaimFormModal selectedItem={selectedItem} userName={userName} onClose={handleCloseClaimForm} onSubmit={handleClaimSubmit} />}
      {isEditFormOpen && <EditFormModal selectedItem={selectedItem} userName={userName} onClose={handleCloseEditForm} onSubmit={handleEditSubmit} />}
      {isSuccessModalOpen && <SuccessModal onClose={handleCloseSuccessModal} onViewHistory={() => { handleCloseSuccessModal(); navigateToScreen('history'); }} />}
    </div>
  );
}

export default App;
