const Show = require('../models/Show');
const Screen = require('../models/Screen');

// @desc    Get shows with optional filters
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;
    const query = { isActive: true };

    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (date) query.showDate = date;

    const shows = await Show.find(query)
      .populate('movieId', 'title posterUrl duration certificate language')
      .populate('theatreId', 'name city address amenities')
      .populate('screenId', 'name screenType totalSeats')
      .sort({ showDate: 1, startTime: 1 });

    res.json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details with screen layout and live booked seats
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      show,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
};
