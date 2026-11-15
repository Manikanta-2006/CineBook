const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Screen name is required'],
      trim: true,
    },
    screenType: {
      type: String,
      enum: ['Standard', 'IMAX', '4DX', 'Dolby Cinema'],
      default: 'Standard',
    },
    soundSystem: {
      type: String,
      default: 'Dolby Atmos 7.1',
    },
    seatLayout: {
      totalRows: { type: Number, default: 8 },
      totalCols: { type: Number, default: 12 },
      aisleColumns: { type: [Number], default: [4, 8] },
      tiers: [
        {
          name: { type: String, required: true }, // e.g. VIP Recliner, Premium, Classic
          rows: [{ type: String, required: true }], // e.g. ['A', 'B']
          priceMultiplier: { type: Number, default: 1.0 },
        },
      ],
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 96,
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

module.exports = mongoose.model('Screen', screenSchema);
