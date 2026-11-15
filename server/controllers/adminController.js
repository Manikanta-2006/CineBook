const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalTheatres = await Theatre.countDocuments({ isActive: true });
    const totalScreens = await Screen.countDocuments({ isActive: true });
    const totalShows = await Show.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'CONFIRMED' });

    // Calculate total revenue from confirmed bookings
    const revenueAggregate = await Booking.aggregate([
      { $match: { bookingStatus: 'CONFIRMED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricingSummary.totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('movieId', 'title posterUrl')
      .populate('theatreId', 'name city')
      .populate('screenId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalScreens,
        totalShows,
        totalBookings,
        confirmedBookings,
        totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MOVIE CRUD ====================

// @desc    Create new Movie
// @route   POST /api/admin/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully!',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Movie
// @route   PUT /api/admin/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully!',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Movie (Soft Delete)
// @route   DELETE /api/admin/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({
      success: true,
      message: 'Movie deactivated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== THEATRE CRUD ====================

// @desc    Create Theatre
// @route   POST /api/admin/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Theatre created successfully!',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Theatre
// @route   PUT /api/admin/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    res.json({
      success: true,
      message: 'Theatre updated successfully!',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Theatre
// @route   DELETE /api/admin/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    res.json({
      success: true,
      message: 'Theatre deactivated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SCREEN CRUD ====================

// @desc    Create Screen
// @route   POST /api/admin/screens
// @access  Private/Admin
const createScreen = async (req, res, next) => {
  try {
    const screen = await Screen.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Screen configured successfully!',
      screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Screen
// @route   PUT /api/admin/screens/:id
// @access  Private/Admin
const updateScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    res.json({
      success: true,
      message: 'Screen updated successfully!',
      screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Screen
// @route   DELETE /api/admin/screens/:id
// @access  Private/Admin
const deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    res.json({
      success: true,
      message: 'Screen deactivated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SHOW CRUD ====================

// @desc    Create Show
// @route   POST /api/admin/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    const populated = await Show.findById(show._id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully!',
      show: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Show
// @route   PUT /api/admin/shows/:id
// @access  Private/Admin
const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({
      success: true,
      message: 'Show updated successfully!',
      show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Show
// @route   DELETE /api/admin/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({
      success: true,
      message: 'Show deactivated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== BOOKINGS AUDIT ====================

// @desc    Get All Bookings across platform
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { search, status, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.bookingId = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('movieId', 'title posterUrl')
      .populate('theatreId', 'name city')
      .populate('screenId', 'name screenType')
      .populate('showId', 'showDate startTime format')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
