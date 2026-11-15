const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  createMovie,
  updateMovie,
  deleteMovie,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  createScreen,
  updateScreen,
  deleteScreen,
  createShow,
  updateShow,
  deleteShow,
  getAllBookings,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Stats
router.get('/stats', getAdminStats);

// Movie CRUD
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// Theatre CRUD
router.post('/theatres', createTheatre);
router.put('/theatres/:id', updateTheatre);
router.delete('/theatres/:id', deleteTheatre);

// Screen CRUD
router.post('/screens', createScreen);
router.put('/screens/:id', updateScreen);
router.delete('/screens/:id', deleteScreen);

// Show CRUD
router.post('/shows', createShow);
router.put('/shows/:id', updateShow);
router.delete('/shows/:id', deleteShow);

// Bookings Audit
router.get('/bookings', getAllBookings);

module.exports = router;
