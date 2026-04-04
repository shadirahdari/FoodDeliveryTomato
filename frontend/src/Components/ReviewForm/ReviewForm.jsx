import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import StarRating from '../StarRating/StarRating';
import './ReviewForm.css';

const ReviewForm = ({ foodId, onReviewAdded }) => {
  const { token, url } = useContext(StoreContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to add a review');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/food/review`, {
        foodId,
        rating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        alert('Review added successfully!');
        setComment('');
        setRating(5);
        onReviewAdded(); // Refresh reviews
      } else {
        alert(response.data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Add review error:', error);
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h4>Add Your Review</h4>
      <form onSubmit={handleSubmit}>
        <div className="rating-input">
          <label>Rating:</label>
          <StarRating rating={rating} onChange={setRating} readonly={false} />
        </div>
        <div className="comment-input">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            required
            rows={4}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;