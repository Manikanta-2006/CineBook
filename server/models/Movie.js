const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    duration: {
      type: Number, // In minutes
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be positive'],
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Primary language is required'],
      default: 'English',
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    certificate: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'U/A', 'A'],
      default: 'PG-13',
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    votesCount: {
      type: Number,
      default: 1200,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    backdropUrl: {
      type: String,
      required: [true, 'Backdrop image URL is required'],
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    formats: {
      type: [String],
      enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby Cinema'],
      default: ['2D'],
    },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, default: '' },
        photo: { type: String, default: '' },
      },
    ],
    director: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

// Auto-generate slug before saving
movieSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
