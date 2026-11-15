import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, MapPin, Ticket, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { moviesAPI } from '../services/api';
import TrailerModal from '../components/movies/TrailerModal';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Available dates: generate next 5 days
  const generateDates = () => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedMonth = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      list.push({ dateString, dayName, formattedMonth });
    }
    return list;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0]?.dateString || '');

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        // Fetch Movie Details
        const movieRes = await moviesAPI.getById(id);
        if (movieRes.data?.movie) {
          setMovie(movieRes.data.movie);
        }

        // Fetch Shows for Movie
        const showsRes = await moviesAPI.getShows(id, { date: selectedDate });
        if (showsRes.data?.theatres) {
          setTheatres(showsRes.data.theatres);
        }
      } catch (err) {
        console.error('Failed to load movie details or shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id, selectedDate]);

  if (loading && !movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-400">Loading cinema experience...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center rounded-2xl bg-cinema-900 border border-white/10">
        <h3 className="text-lg font-bold text-white">Movie Not Found</h3>
        <p className="text-xs text-slate-400 mt-2">The movie you requested could not be located.</p>
        <Link to="/movies" className="inline-block mt-4 px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl">
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-12 pb-24">
      {/* Backdrop Header */}
      <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden bg-cinema-950">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-40 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/90 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 w-full">
            {/* Poster Card */}
            <div className="relative w-40 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 bg-cinema-900 hidden sm:block">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/10 text-white border border-white/15 uppercase">
                  {movie.certificate || 'PG-13'}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-black/60 text-amber-400 border border-white/15">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}</span>
                  <span className="text-[10px] text-slate-400">({movie.votesCount?.toLocaleString()} votes)</span>
                </div>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {movie.duration} mins
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {movie.language}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                {movie.genres?.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">
                    {g}
                  </span>
                ))}
              </div>

              {movie.trailerUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white text-white" /> Watch Official Trailer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Synopsis & Cast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> About the Movie
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10">
              {movie.description}
            </p>

            {/* Cast & Crew Gallery */}
            {movie.cast?.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Top Billed Cast
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {movie.cast.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-amber-400">
                        {c.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{c.role || 'Actor'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Specifications Box */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Movie Specifications</h3>
            <div className="p-6 rounded-2xl bg-cinema-900 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Director</span>
                <span className="font-semibold text-white">{movie.director || 'Visionary Director'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Release Date</span>
                <span className="font-semibold text-white">
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Available Formats</span>
                <span className="font-semibold text-amber-400">{movie.formats?.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Certificate</span>
                <span className="font-semibold text-white">{movie.certificate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector Chips */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Select Date & Showtimes
            </h3>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {dates.map((d) => {
              const isSelected = selectedDate === d.dateString;
              return (
                <button
                  key={d.dateString}
                  onClick={() => setSelectedDate(d.dateString)}
                  className={`flex flex-col items-center min-w-[100px] py-3 px-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-glow-gold scale-102'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase">{d.dayName}</span>
                  <span className="text-sm font-black mt-0.5">{d.formattedMonth}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theatres & Showtimes List */}
        <div className="space-y-6">
          {theatres.length > 0 ? (
            theatres.map((theatreObj) => (
              <div
                key={theatreObj.theatre._id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{theatreObj.theatre.name}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {theatreObj.theatre.address} • {theatreObj.theatre.city}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {theatreObj.theatre.amenities?.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Available Showtimes:
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {theatreObj.shows.map((show) => {
                      const minPrice = show.tierPricing?.[show.tierPricing.length - 1]?.price || 15;
                      const availableCount = show.totalSeats - (show.bookedCount || 0);

                      return (
                        <Link
                          key={show._id}
                          to={`/shows/${show._id}/seats`}
                          className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/60 transition-all duration-200 min-w-[130px]"
                        >
                          <span className="text-sm font-extrabold text-white group-hover:text-amber-300">
                            {show.startTime}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                            <span className="font-semibold text-amber-400">{show.format}</span>
                            <span>•</span>
                            <span className="font-mono text-emerald-400">₹{minPrice}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-0.5">
                            {availableCount} seats left
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-3xl bg-cinema-900/50 border border-white/10 space-y-3">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">No shows scheduled for {selectedDate}</h4>
              <p className="text-xs text-slate-400">Try selecting another date chip above.</p>
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailsPage;
