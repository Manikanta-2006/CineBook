const crypto = require('crypto');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Helper to generate unique human-readable Booking ID: e.g. CB-89FA2D
const generateBookingId = () => {
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const datePart = Date.now().toString(36).slice(-3).toUpperCase();
  return `CB-${datePart}${randomPart}`;
};

// @desc    Create new booking with ATOMIC double-booking guard
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  let reservedSeats = [];
  let currentShowId = null;

  try {
    const { showId, seats, paymentMethod = 'Simulated UPI (Google Pay / PhonePe)' } = req.body;

    // 1. Validation
    if (!showId) {
      return res.status(400).json({
        success: false,
        message: 'Show ID is required.',
      });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat.',
      });
    }

    if (seats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 seats allowed per single booking transaction.',
      });
    }

    const show = await Show.findById(showId);
    if (!show || !show.isActive) {
      return res.status(404).json({
        success: false,
        message: 'The requested show is either inactive or does not exist.',
      });
    }

    currentShowId = showId;
    const selectedSeatCodes = seats.map((s) => s.seatNumber);
    reservedSeats = selectedSeatCodes;

    // 2. ATOMIC DOUBLE-BOOKING PREVENTION
    // We update ONLY IF NONE of the requested seats are in `bookedSeats` ($nin).
    // If another transaction booked even one of these seats a microsecond earlier,
    // this query matches 0 documents and returns null atomically!
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: selectedSeatCodes },
        isActive: true,
      },
      {
        $push: { bookedSeats: { $each: selectedSeatCodes } },
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message:
          'One or more of the selected seats are already booked or being booked by another customer. Please choose different seats.',
        conflictingSeats: selectedSeatCodes,
      });
    }

    // 3. Calculate Indian Cinema Pricing (in ₹)
    const subtotal = seats.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const convenienceFee = seats.length * 35; // ₹35 per seat convenience fee
    const tax = Math.round(subtotal * 0.18); // 18% GST (9% CGST + 9% SGST)
    const totalAmount = subtotal + convenienceFee + tax;

    // 4. Generate Unique Booking ID & Simulated Indian Transaction
    const bookingId = generateBookingId();
    const transactionId = `TXN-UPI-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const qrPayload = JSON.stringify({
      bookingId,
      user: req.user._id,
      showId: show._id,
      seats: selectedSeatCodes,
      amount: `₹${totalAmount}`,
      verified: true,
    });

    // 5. Create Booking Record
    const booking = await Booking.create({
      bookingId,
      userId: req.user._id,
      showId: show._id,
      movieId: show.movieId,
      theatreId: show.theatreId,
      screenId: show.screenId,
      seats: seats.map((s) => ({
        seatNumber: s.seatNumber,
        row: s.row || s.seatNumber.charAt(0),
        col: s.col || parseInt(s.seatNumber.slice(1), 10),
        tier: s.tier || 'Standard',
        price: Number(s.price),
      })),
      pricingSummary: {
        subtotal,
        convenienceFee,
        tax,
        totalAmount,
      },
      paymentDetails: {
        status: 'PAID',
        method: paymentMethod,
        transactionId,
        paidAt: new Date(),
        isSimulated: true,
      },
      bookingStatus: 'CONFIRMED',
      qrPayload,
    });

    // Populate references for client response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movieId', 'title posterUrl duration certificate language')
      .populate('theatreId', 'name city address amenities')
      .populate('screenId', 'name screenType')
      .populate('showId', 'showDate startTime endTime format language')
      .populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    // Rollback atomic seat lock if booking document creation fails
    if (currentShowId && reservedSeats.length > 0) {
      await Show.findByIdAndUpdate(currentShowId, {
        $pullAll: { bookedSeats: reservedSeats },
      });
    }
    next(error);
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title posterUrl duration certificate language formats')
      .populate('theatreId', 'name city address')
      .populate('screenId', 'name screenType')
      .populate('showId', 'showDate startTime endTime format')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or bookingId string
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    if (id.startsWith('CB-')) {
      query = { bookingId: id };
    } else {
      query = { _id: id };
    }

    const booking = await Booking.findOne(query)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId')
      .populate('showId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Check authorization: user must own the booking or be admin
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this booking.',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Releases seats back to Show atomically)
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    if (id.startsWith('CB-')) {
      query = { bookingId: id };
    } else {
      query = { _id: id };
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Verify ownership
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot cancel this booking.',
      });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    // 1. Atomically release booked seats back to the show
    const seatCodes = booking.seats.map((s) => s.seatNumber);
    await Show.findByIdAndUpdate(booking.showId, {
      $pullAll: { bookedSeats: seatCodes },
    });

    // 2. Mark booking as cancelled and refund simulated payment
    booking.bookingStatus = 'CANCELLED';
    booking.paymentDetails.status = 'REFUNDED';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
