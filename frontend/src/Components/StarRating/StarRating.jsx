import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, readonly = false, size = 'medium', onChange }) => {
  const stars = [];
  const maxStars = 5;

  const handleClick = (newRating) => {
    if (!readonly && onChange) {
      onChange(newRating);
    }
  };

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= rating;
    stars.push(
      <span 
        key={i} 
        className={`star ${isFilled ? 'filled' : 'empty'} ${size} ${!readonly ? 'clickable' : ''}`}
        onClick={() => handleClick(i)}
        style={{ cursor: !readonly ? 'pointer' : 'default' }}
      >
        {isFilled ? '★' : '☆'}
      </span>
    );
  }

  return (
    <div className={`star-rating ${readonly ? 'readonly' : ''}`}>
      {stars}
    </div>
  );
};

export default StarRating;