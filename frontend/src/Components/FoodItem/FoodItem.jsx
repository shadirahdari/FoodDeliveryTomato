import React, { useContext, useState} from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import StarRating from '../StarRating/StarRating';
import ReviewsList from '../ReviewsList/ReviewsList';
import ReviewForm from '../ReviewForm/ReviewForm';

const FoodItem = ({ id, name, price, description, image, averageRating, totalReviews }) => {
  
  const {cartItems,addToCart,removeFromCart,url, token}=useContext(StoreContext);
  const [showReviews, setShowReviews] = useState(false);

  const handleRatingClick = () => {
    setShowReviews(!showReviews);
  };

  const handleReviewAdded = () => {
    // Refresh the page or update the food list to get new ratings
    window.location.reload();
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt="" />
        { 
          !cartItems [id] ? (
            <img
              className='add'
              onClick={() => addToCart(id)}
              src={assets.add_icon_white}
              alt=''
            />
          ) : (
            <div className='food-item-counter'>
              <img
                onClick={() => removeFromCart(id)}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={() => addToCart(id)}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )
        }
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div 
            className="rating-container" 
            onClick={handleRatingClick}
            style={{ cursor: 'pointer' }}
          >
            <StarRating 
              rating={averageRating || 0} 
              readonly 
              size="small" 
            />
            <span className="review-count">
              ({totalReviews || 0} reviews)
            </span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>

      {showReviews && (
        <div className="reviews-modal">
          <div className="reviews-modal-content">
            <div className="reviews-modal-header">
              <h3>Reviews for {name}</h3>
              <button 
                className="close-reviews"
                onClick={() => setShowReviews(false)}
              >
                ✕
              </button>
            </div>
            {token && <ReviewForm foodId={id} onReviewAdded={handleReviewAdded} />}
            <ReviewsList foodId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
