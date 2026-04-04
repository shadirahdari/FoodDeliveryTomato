import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";

// Add a review
const addReview = async (req, res) => {
  const { foodId, rating, comment } = req.body;
  const userId = req.userId; // From auth middleware

  try {
    const newReview = new reviewModel({
      user: userId,
      food: foodId,
      rating,
      comment
    });

    await newReview.save();

    // Update food's average rating and total reviews
    const reviews = await reviewModel.find({ food: foodId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await foodModel.findByIdAndUpdate(foodId, {
      averageRating: averageRating.toFixed(1),
      totalReviews
    });

    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Add review error:", error);
    res.json({ success: false, message: "Failed to add review" });
  }
};

// Get reviews for a food
const getReviewsForFood = async (req, res) => {
  const { foodId } = req.params;

  try {
    const reviews = await reviewModel.find({ food: foodId }).populate('user', 'name').sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.json({ success: false, message: "Failed to fetch reviews" });
  }
};

export { addReview, getReviewsForFood };