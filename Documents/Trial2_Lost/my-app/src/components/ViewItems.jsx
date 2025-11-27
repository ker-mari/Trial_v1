import React, { useState, useMemo } from 'react';

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

const valuableCategories = ['Gadgets / Electronics', 'Money and Payment Items', 'Identification and Wallets', 'Bags and Storage', 'Jewelry / Valuables'];

const ViewItems = ({ items, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [codeFilter, setCodeFilter] = useState('All'); // 'All', 'L', 'V'

  // Helper function to check if item is valuable
  const isValuable = (item) => {
    return item.is_valuable || valuableCategories.includes(item.category);
  };

  // Filter items based on search query and code filter, sort newest to oldest
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Code filter (L = Lost/Regular, V = Valuable)
      if (codeFilter === 'L' && isValuable(item)) return false;
      if (codeFilter === 'V' && !isValuable(item)) return false;

      // Search filter
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        item.category?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        String(item.item_no || item.itemNo || item.id).toLowerCase().includes(query)
      );
    }).sort((a, b) => {
      const dateA = new Date(a.created_at || a.date_time || a.date);
      const dateB = new Date(b.created_at || b.date_time || b.date);
      return dateB - dateA; // Newest first
    });
  }, [items, searchQuery, codeFilter]);

  return (
    <div className="view-items-screen">
      {/* Search and Filter Bar */}
      <div className="search-filter-container">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search by item number, category, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="view-items-search-input"
          />
          <span className="search-icon-view">🔍</span>
        </div>

        <div className="filter-and-results">
          <div className="code-filter-wrapper">
            <button
              className={`code-filter-btn ${codeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setCodeFilter('All')}
            >
              All Items
            </button>
            <button
              className={`code-filter-btn code-l ${codeFilter === 'L' ? 'active' : ''}`}
              onClick={() => setCodeFilter('L')}
            >
              <span className="code-badge-filter lost">L</span> Lost Items
            </button>
            <button
              className={`code-filter-btn code-v ${codeFilter === 'V' ? 'active' : ''}`}
              onClick={() => setCodeFilter('V')}
            >
              <span className="code-badge-filter valuable">V</span> Valuable Items
            </button>
          </div>
          
          {(searchQuery || codeFilter !== 'All') && (
            <div className="results-count">
              {filteredItems.length} items found
            </div>
          )}
        </div>
      </div>



      <div className="items-grid">
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="item-card" key={item.id}>
              <div className="item-card-header">
                <h3>item no. {item.itemNo || String(item.id).padStart(5, '0')}</h3>
                {isValuable(item) && <span className="valuable-tag">Valuable</span>}
              </div>
              <p className="item-category">{item.category}</p>
              <div className="item-image-placeholder">
                {item.image && (item.image.startsWith('http') || item.image.startsWith('data:image/')) ? (
                  <img src={item.image} alt="Item" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                ) : (
                  categoryEmojis[item.category]?.startsWith('http') ? (
                    <img src={categoryEmojis[item.category]} alt={item.category} style={{width: '130px', height: '130px'}} />
                  ) : (
                    categoryEmojis[item.category] || '📦'
                  )
                )}
              </div>
              <button className="view-details-btn" onClick={() => onViewDetails(item)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
            minHeight: '300px',
            background: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              opacity: 0.5
            }}>🔍</div>
            <h3 style={{
              fontSize: '1.25rem',
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: '"Atkinson Hyperlegible", sans-serif'
            }}>
              No items available
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '16px',
              fontFamily: '"Atkinson Hyperlegible", sans-serif'
            }}>
              Check back later for new items
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItems;