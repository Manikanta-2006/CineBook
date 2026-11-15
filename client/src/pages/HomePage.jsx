import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, MapPin, Search, Calendar, ChevronRight, Award, Volume2, Armchair } from 'lucide-react';
import { moviesAPI } from '../services/api';
import MovieHeroBanner from '../components/movies/MovieHeroBanner';
import MovieCard from '../components/movies/MovieCard';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('now-showing');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await moviesAPI.getAll();
        if (res.data && res.data.movies) {
          setMovies(res.data.movies);
          const featured = res.data.movies.filter((m) => m.isFeatured);
          setFeaturedMovies(featured.length > 0 ? featured : res.data.movies.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const release = new Date(m.releaseDate);

    if (activeTab === 'now-showing') {
      return release <= today;
    } else {
      return release > today;
    }
  });

  return (
    <div className="min-h-screen space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {loading ? (
          <div className="w-full h-[500px] rounded-3xl bg-cinema-900 animate-pulse flex items-center justify-center">
            <Film className="w-12 h-12 text-slate-700 animate-bounce" />
          </div>
        ) : (
          <MovieHeroBanner movies={featuredMovies} />
        )}
      </section>

      {/* Search & Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 shadow-xl">
          {/* Tabs: Now Showing vs Upcoming */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('now-showing')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'now-showing'
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Upcoming Releases
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movie title, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Movies Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'now-showing' ? 'In Theatres Now' : 'Coming Soon to CineBook'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {activeTab === 'now-showing'
                ? 'Select a movie to browse showtimes, screen formats and reserve your seats'
                : 'Stay ahead of upcoming blockbuster releases'}
            </p>
          </div>

          <Link
            to="/movies"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-cinema-900 animate-pulse" />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-cinema-900/50 border border-white/10 space-y-3">
            <Film className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No movies found</h4>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or switch tabs.</p>
          </div>
        )}
      </section>

      {/* Experience / Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              The CineBook Standard
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted for True Film Connoisseurs
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every auditorium on the CineBook network features high-contrast laser projection, calibrated spatial Dolby Atmos sound, and ergonomic luxury recliners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Award className="w-8 h-8 text-amber-400" />
              <h4 className="text-base font-bold text-white">IMAX Laser 70mm</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crystal clear 4K dual laser projection with expansive aspect ratios for maximum immersion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Volume2 className="w-8 h-8 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Dolby Atmos Audio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-dimensional sound that moves all around you with breathtaking depth and clarity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Armchair className="w-8 h-8 text-rose-400" />
              <h4 className="text-base font-bold text-white">VIP Plush Recliners</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Motorized headrests, wide armrests, and personal swivel dining tables for effortless comfort.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
