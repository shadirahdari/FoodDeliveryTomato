import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const url = 'http://localhost:4001';

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/food/reviews/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${url}/api/food/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        alert('Review deleted successfully');
        fetchAllReviews();
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="reviews-admin">Loading reviews...</div>;
  }

  return (
    <div className="reviews-admin">
      <h2>Reviews Management</h2>
      <div className="reviews-stats">
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <p>{reviews.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</p>
        </div>
      </div>

      <div className="reviews-table">
        <table>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id}>
                <td>{review.food?.name || 'Unknown Food'}</td>
                <td>{review.user?.name || 'Unknown User'}</td>
                <td>
                  <div className="rating-display">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'star filled' : 'star empty'}>
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                    <span className="rating-number">({review.rating})</span>
                  </div>
                </td>
                <td className="comment-cell">
                  {review.comment.length > 50 ? 
                    `${review.comment.substring(0, 50)}...` : 
                    review.comment}
                </td>
                <td>{new Date(review.date).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedReview(review)}
                  >
                    View
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteReview(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReview && (
        <div className="review-modal">
          <div className="review-modal-content">
            <div className="review-modal-header">
              <h3>Review Details</h3>
              <button 
                className="close-modal"
                onClick={() => setSelectedReview(null)}
              >
                ✕
              </button>
            </div>
            <div className="review-details">
              <p><strong>Food:</strong> {selectedReview.food?.name}</p>
              <p><strong>User:</strong> {selectedReview.user?.name}</p>
              <p><strong>Rating:</strong> 
                <span className="rating-display">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < selectedReview.rating ? 'star filled' : 'star empty'}>
                      {i < selectedReview.rating ? '★' : '☆'}
                    </span>
                  ))}
                  <span className="rating-number">({selectedReview.rating})</span>
                </span>
              </p>
              <p><strong>Comment:</strong></p>
              <p className="review-comment-full">{selectedReview.comment}</p>
              <p><strong>Date:</strong> {new Date(selectedReview.date).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;