const express = require('express');
const { protect } = require('../controllers/authController');
const {
  getCompletedRequests,     // provider-side
  getCompletedForSeeker,    // seeker-side (review dropdown)
  updateRequestStatus
} = require('../controllers/serviceRequestController');

const router = express.Router();

// Seeker: fetch your own completed requests
router.get('/completed', protect, getCompletedForSeeker);

// Provider: fetch your completed requests
router.get('/completed/provider', protect, getCompletedRequests);

// Provider: update status (e.g. mark complete)
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;
