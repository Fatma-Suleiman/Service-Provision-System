// routes/providers.js
const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');

const {
  getMyProfile,
  createProviderProfile,
  updateProviderProfile,
  getMySummary,
  getMyRequests
} = require('../controllers/providers');

const { updateRequestStatus } = require('../controllers/serviceRequestController');

const { getProviderReviews } = require('../controllers/reviewController');

// Protect all routes below
router.use(protect);

// Profile
router.route('/me')
  .get(getMyProfile)
  .post(upload.single('image'), createProviderProfile)
  .put(upload.single('image'), updateProviderProfile);

// Dashboard
router.get('/me/summary', getMySummary);
router.get('/me/requests', getMyRequests);
router.put('/me/requests/:id', updateRequestStatus);
// Reviews
router.get('/reviews', getProviderReviews);




module.exports = router;

