
import React, { useState } from "react";
import api from "../api";     

function ReviewForm() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review || rating < 1 || rating > 5) {
      setError("Please provide a valid review and rating.");
      return;
    }

    try {
      // no URL or headers needed—api has baseURL & interceptor
      await api.post("/reviews", { review, rating });
      alert("Review submitted successfully!");
      setReview("");
      setRating(1);
      setError("");
    } catch (err) {
      console.error("Submit review error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
        "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here"
            rows="4"
            cols="50"
          />
        </div>
        <div>
          <label>Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="1"
            max="5"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;
