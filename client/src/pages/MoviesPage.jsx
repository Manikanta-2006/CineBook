import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Film, Sparkles, X } from 'lucide-react';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/movies/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Biography', 'Crime', 'Animation'];
const FORMATS = ['All', '2D', '3D', 'IMAX', '4DX', 'Dolby Cinema'];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (selectedGenre !== 'All') params.genre = selectedGenre;
        if (selectedFormat !== 'All') params.format = selectedFormat;
        if (status !== 'All') params.status = status;

        const res = await moviesAPI.getAll(params);
        if (res.data && res.data.movies) {
          setMovies(res.data.movies);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, selectedGenre, selectedFormat, status]);

  const clearFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedFormat('All');
    setStatus('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Movies
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse the latest releases, filter by format and discover shows in your city
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-cinema-900 text-white">
                  Genre: {g}
                </option>
              ))}
            </select>
          </div>

          {/* Format Dropdown */}
          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f} className="bg-cinema-900 text-white">
                  Format: {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Release Status:</span>
            {['All', 'now-showing', 'upcoming'].map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  status === st
                    ? 'bg-amber-500 text-black shadow-glow-gold'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {st.replace('-', ' ')}
              </button>
            ))}
          </div>

          {(search || selectedGenre !== 'All' || selectedFormat !== 'All' || status !== 'All') && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-cinema-900 animate-pulse" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-cinema-900/50 border border-white/10 space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No movies match your criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black mt-2"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
