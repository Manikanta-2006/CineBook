const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');

// @desc    Get all active theatres
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const theatres = await Theatre.find(query).sort({ city: 1, name: 1 });

    res.json({
      success: true,
      count: theatres.length,
      theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    const screens = await Screen.find({ theatreId: theatre._id, isActive: true });

    res.json({
      success: true,
      theatre,
      screens,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct list of cities
// @route   GET /api/theatres/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.find({ isActive: true }).distinct('city');
    res.json({
      success: true,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  getCities,
};
