import React from 'react';

const ViewItems = ({ items, onViewDetails }) => {
  const getCategoryEmoji = (category) => {
    const emojis = {
      'Electronics': '📱',
      'Accessories': '🌸',
      'School Supplies': '📚',
      'Personal Belongings': '💼',
      'Sports Equipments': '🏀',
      'Clothing': '🧥',
      'Food and Drinks': '🍱'
    };
    return emojis[category] || '📦';
  };

  return (
    <div className="view-items-screen">
      <div className="items-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <div className="item-card-header">
              <h3>item no. {item.itemNo || String(item.id).padStart(5, '0')}</h3>
              {item.is_valuable && <span className="valuable-tag">Valuable</span>}
            </div>
            <p className="item-category">{item.category}</p>
            <div className="item-image-placeholder">{getCategoryEmoji(item.category)}</div>
            <button className="view-details-btn" onClick={() => onViewDetails(item)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewItems;