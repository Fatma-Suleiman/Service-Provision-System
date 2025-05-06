const express = require('express');   
const router = express.Router();
const { protect } = require('../controllers/authController');
const {
  createReview,
  getAllReviews,
  getProviderReviews
} = require('../controllers/reviewController');

// Public: list all reviews
router.get('/all', getAllReviews);

// Protected: submit a review
router.post('/', protect, createReview);

// Protected: get reviews for the logged-in provider
router.get('/provider', protect, getProviderReviews);

module.exports = router;
