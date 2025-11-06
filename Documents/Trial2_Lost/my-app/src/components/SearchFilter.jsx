import React, { useState, useEffect } from 'react';

const SearchFilter = ({ onSearch, onFilter, filters, resultsCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    onFilter({ type, category: selectedCategory, location: selectedLocation });
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    onFilter({ type: selectedType, category, location: selectedLocation });
  };

  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
    onFilter({ type: selectedType, category: selectedCategory, location });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedLocation('');
    onSearch('');
    onFilter({ type: '', category: '', location: '' });
  };

  return (
    <div style={{
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search items by description, category, location, or item number..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}
        />
      </div>

      {/* Filter Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Item Type Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#374151',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}>
            Item Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: '"Atkinson Hyperlegible", sans-serif'
            }}
          >
            <option value="">All Items</option>
            <option value="code_l">Code L (Regular Items)</option>
            <option value="code_v">Code V (Valuable Items)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#374151',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: '"Atkinson Hyperlegible", sans-serif'
            }}
          >
            <option value="">All Categories</option>
            {filters?.categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#374151',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}>
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: '"Atkinson Hyperlegible", sans-serif'
            }}
          >
            <option value="">All Locations</option>
            {filters?.locations?.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button and Results Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          onClick={clearFilters}
          style={{
            padding: '0.5rem 1rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}
        >
          Clear All Filters
        </button>
        
        {resultsCount !== undefined && (
          <div className="results-count">
            {resultsCount} items found
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedType || selectedCategory || selectedLocation || searchTerm) && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f3f4f6',
          borderRadius: '6px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            fontFamily: '"Atkinson Hyperlegible", sans-serif'
          }}>
            Active Filters:
          </span>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {searchTerm && (
              <span style={{
                background: '#3b82f6',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Search: "{searchTerm}"
              </span>
            )}
            {selectedType && (
              <span style={{
                background: '#10b981',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {selectedType === 'code_v' ? 'Code V (Valuable)' : 'Code L (Regular)'}
              </span>
            )}
            {selectedCategory && (
              <span style={{
                background: '#f59e0b',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Category: {selectedCategory}
              </span>
            )}
            {selectedLocation && (
              <span style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Location: {selectedLocation}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;