const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: [true, 'Screen reference is required'],
      index: true,
    },
    showDate: {
      type: String, // YYYY-MM-DD format
      required: [true, 'Show date is required (YYYY-MM-DD)'],
      index: true,
    },
    startTime: {
      type: String, // e.g. "19:00" or "07:00 PM"
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // e.g. "21:45" or "09:45 PM"
      required: [true, 'End time is required'],
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby Cinema'],
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
    },
    tierPricing: [
      {
        tierName: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    // Booked seat codes, e.g. ['A1', 'A2', 'D5']
    bookedSeats: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying shows by movie and date efficiently
showSchema.index({ movieId: 1, showDate: 1, theatreId: 1 });

module.exports = mongoose.model('Show', showSchema);
