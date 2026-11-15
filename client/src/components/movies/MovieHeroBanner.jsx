import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Ticket, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import TrailerModal from './TrailerModal';

const MovieHeroBanner = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex] || movies[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full h-[580px] md:h-[650px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-cinema-900 group">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700"
          />
          {/* Multi-layered cinematic gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-cinema-950/60"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-16">
          <div className="max-w-2xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Featured Premiere
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/15 uppercase">
                {currentMovie.certificate || 'PG-13'}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-white/15">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentMovie.rating?.toFixed(1) || '8.5'}</span>
              </div>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentMovie.duration} mins
              </span>
            </div>

            {/* Movie Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {currentMovie.title}
            </h1>

            {/* Genres & Formats */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              {currentMovie.genres?.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  {g}
                </span>
              ))}
              {currentMovie.formats?.map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  {fmt}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm md:text-base text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
              {currentMovie.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={`/movies/${currentMovie._id}`}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-glow-gold transition-all duration-200 flex items-center gap-2 transform active:scale-98"
              >
                <Ticket className="w-4 h-4" /> Book Tickets Now
              </Link>

              {currentMovie.trailerUrl && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white text-white" /> Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Controls if multiple featured movies */}
        {movies.length > 1 && (
          <div className="absolute right-6 bottom-16 z-20 flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/15 backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/15 backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={currentMovie.trailerUrl}
        movieTitle={currentMovie.title}
      />
    </>
  );
};

export default MovieHeroBanner;
