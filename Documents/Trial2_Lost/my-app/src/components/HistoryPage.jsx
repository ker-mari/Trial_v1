import React from 'react';

const HistoryPage = ({ historyItems }) => {
  // Filter out 'Handed Over' items
  const filteredItems = historyItems?.filter(item => item.status !== 'Handed Over') || [];

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
    <div className="screen-layout">
      <div className="table-container history-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date ↑</th>
              <th>Time</th>
              <th>Code ▼</th>
              <th>Item Name</th>
              <th>Owner</th>
              <th style={{textAlign: 'center'}}>Status</th>
              <th>Officer</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
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
                        item.status === 'Available' ? 'status-claimable' :
                        item.status === 'Edit Rejected' ? 'status-rejected' : ''
                      }`}>
                        {item.status === 'Available' ? 'Claimable' : item.status || 'N/A'}
                      </span>
                    </td>
                    <td>{item.officer || 'N/A'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;