const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all active movies with optional filtering & search
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, format, isFeatured, status } = req.query;

    const query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.language = language;
    }

    if (format && format !== 'All') {
      query.formats = { $in: [format] };
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === 'now-showing') {
      query.releaseDate = { $lte: today };
    } else if (status === 'upcoming') {
      query.releaseDate = { $gt: today };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1, rating: -1 });

    res.json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID or Slug
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let movie;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(id);
    } else {
      movie = await Movie.findOne({ slug: id, isActive: true });
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows for a specific movie, grouped by Theatre
// @route   GET /api/movies/:id/shows
// @access  Public
const getMovieShows = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, city } = req.query;

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const showQuery = {
      movieId: movie._id,
      isActive: true,
    };

    if (date) {
      showQuery.showDate = date;
    }

    const shows = await Show.find(showQuery)
      .populate('theatreId')
      .populate('screenId')
      .sort({ startTime: 1 });

    // Filter by city if requested
    let filteredShows = shows;
    if (city && city !== 'All') {
      filteredShows = shows.filter(
        (show) => show.theatreId && show.theatreId.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Group shows by Theatre
    const groupedTheatres = {};

    filteredShows.forEach((show) => {
      const theatre = show.theatreId;
      if (!theatre) return;

      const theatreKey = theatre._id.toString();
      if (!groupedTheatres[theatreKey]) {
        groupedTheatres[theatreKey] = {
          theatre: {
            _id: theatre._id,
            name: theatre.name,
            city: theatre.city,
            address: theatre.address,
            amenities: theatre.amenities,
          },
          shows: [],
        };
      }

      groupedTheatres[theatreKey].shows.push({
        _id: show._id,
        screen: {
          _id: show.screenId._id,
          name: show.screenId.name,
          screenType: show.screenId.screenType,
        },
        showDate: show.showDate,
        startTime: show.startTime,
        endTime: show.endTime,
        format: show.format,
        language: show.language,
        tierPricing: show.tierPricing,
        bookedCount: show.bookedSeats.length,
        totalSeats: show.screenId.totalSeats,
      });
    });

    res.json({
      success: true,
      movie: {
        _id: movie._id,
        title: movie.title,
        certificate: movie.certificate,
        duration: movie.duration,
        posterUrl: movie.posterUrl,
      },
      theatres: Object.values(groupedTheatres),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMovieShows,
};
