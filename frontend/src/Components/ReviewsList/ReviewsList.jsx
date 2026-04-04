import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { useContext } from 'react';
import StarRating from '../StarRating/StarRating';
import './ReviewsList.css';

const ReviewsList = ({ foodId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${url}/api/food/reviews/${foodId}`);
        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [foodId, url]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="reviews-list">
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(review => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <strong>{review.user.name}</strong>
              <StarRating rating={review.rating} readonly size="small" />
              <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;