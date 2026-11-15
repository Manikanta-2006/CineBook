const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        row: { type: String, required: true },
        col: { type: Number, required: true },
        tier: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    pricingSummary: {
      subtotal: { type: Number, required: true },
      convenienceFee: { type: Number, required: true, default: 30 },
      tax: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    paymentDetails: {
      status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PAID',
      },
      method: {
        type: String,
        default: 'Simulated Card',
      },
      transactionId: {
        type: String,
        required: true,
      },
      paidAt: {
        type: Date,
        default: Date.now,
      },
      isSimulated: {
        type: Boolean,
        default: true,
      },
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    qrPayload: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
