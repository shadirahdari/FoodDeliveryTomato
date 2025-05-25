import React, { useState, useContext, useEffect } from 'react';
import './SearchModal.css';
import { StoreContext } from '../../Context/StoreContext';

const SearchModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { food_list, url } = useContext(StoreContext);

  useEffect(() => {
    // Filter food items based on search term
    const results = food_list.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, food_list]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''; // Return empty string if no image
    if (imagePath.startsWith('http')) return imagePath; // Return as is if already a full URL
    return `${url}/${imagePath}`; // Combine with base URL for relative paths
  };

  return (
    <div className="search-modal" onClick={(e) => {
      if (e.target.className === 'search-modal') onClose();
    }}>
      <div className="search-content">
        <div className="search-header">
          <input
            type="text"
            placeholder="Search for dishes, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="search-results">
          {searchTerm.length > 0 ? (
            searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div key={item._id} className="search-item">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = '/placeholder-food.png'; // Set a default image
                    }}
                  />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="item-category">{item.category}</span>
                    <span className="item-price">€{item.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No items found</div>
            )
          ) : (
            <div className="search-prompt">
              Start typing to search for food items...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 