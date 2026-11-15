import React, { useState, useEffect } from 'react';
import {
  Shield,
  Film,
  MapPin,
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { adminAPI, moviesAPI, theatresAPI, showsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data states for CRUD
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Modals state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    duration: 120,
    genres: 'Action, Sci-Fi',
    language: 'English',
    releaseDate: '2024-05-01',
    certificate: 'PG-13',
    rating: 8.5,
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    formats: '2D, IMAX',
    director: '',
  });

  // Theatre Modal State
  const [theatreModalOpen, setTheatreModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    zipCode: '',
    phone: '',
    amenities: 'Dolby Atmos, IMAX Laser, Recliner Seats, Gourmet Food Lounge',
  });

  // Show Modal State
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '07:00 PM',
    endTime: '09:45 PM',
    format: 'IMAX',
    language: 'Hindi',
    vipPrice: 580,
    premiumPrice: 320,
    classicPrice: 190,
  });

  // Screens list for selected theatre in show modal
  const [availableScreens, setAvailableScreens] = useState([]);

  // Booking search query
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Load Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
        adminAPI.getStats(),
        moviesAPI.getAll(),
        theatresAPI.getAll(),
        showsAPI.getAll(),
        adminAPI.getAllBookings(),
      ]);

      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
        setRecentBookings(statsRes.data.recentBookings || []);
      }
      if (moviesRes.data?.movies) setMovies(moviesRes.data.movies);
      if (theatresRes.data?.theatres) setTheatres(theatresRes.data.theatres);
      if (showsRes.data?.shows) setShows(showsRes.data.shows);
      if (bookingsRes.data?.bookings) setAllBookings(bookingsRes.data.bookings);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      toast.error('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update available screens when theatre changes in Show Modal
  useEffect(() => {
    if (showForm.theatreId) {
      const fetchScreens = async () => {
        try {
          const res = await theatresAPI.getById(showForm.theatreId);
          if (res.data?.screens) {
            setAvailableScreens(res.data.screens);
            if (res.data.screens.length > 0) {
              setShowForm((prev) => ({ ...prev, screenId: res.data.screens[0]._id }));
            }
          }
        } catch (err) {
          console.warn('Could not load screens for theatre');
        }
      };
      fetchScreens();
    }
  }, [showForm.theatreId]);

  // ==================== MOVIE CRUD HANDLERS ====================
  const handleOpenMovieCreate = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      description: '',
      duration: 120,
      genres: 'Action, Sci-Fi',
      language: 'English',
      releaseDate: new Date().toISOString().split('T')[0],
      certificate: 'PG-13',
      rating: 8.5,
      posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      formats: '2D, IMAX, Dolby Cinema',
      director: '',
    });
    setMovieModalOpen(true);
  };

  const handleOpenMovieEdit = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genres: movie.genres?.join(', ') || '',
      language: movie.language,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      certificate: movie.certificate || 'PG-13',
      rating: movie.rating || 8.5,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl || '',
      formats: movie.formats?.join(', ') || '2D',
      director: movie.director || '',
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
        genres: movieForm.genres.split(',').map((g) => g.trim()),
        formats: movieForm.formats.split(',').map((f) => f.trim()),
      };

      if (editingMovie) {
        await adminAPI.updateMovie(editingMovie._id, payload);
        toast.success(`Movie "${payload.title}" updated successfully!`);
      } else {
        await adminAPI.createMovie(payload);
        toast.success(`Movie "${payload.title}" created successfully!`);
      }

      setMovieModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save movie.');
    }
  };

  const handleDeleteMovie = async (movieId, title) => {
    if (!window.confirm(`Are you sure you want to deactivate movie "${title}"?`)) return;
    try {
      await adminAPI.deleteMovie(movieId);
      toast.success('Movie deactivated.');
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate movie.');
    }
  };

  // ==================== THEATRE CRUD HANDLERS ====================
  const handleOpenTheatreCreate = () => {
    setEditingTheatre(null);
    setTheatreForm({
      name: '',
      city: 'New York',
      address: '',
      zipCode: '',
      phone: '',
      amenities: 'Dolby Atmos, IMAX Laser, Recliner Seats',
    });
    setTheatreModalOpen(true);
  };

  const handleOpenTheatreEdit = (theatre) => {
    setEditingTheatre(theatre);
    setTheatreForm({
      name: theatre.name,
      city: theatre.city,
      address: theatre.address,
      zipCode: theatre.zipCode || '',
      phone: theatre.phone || '',
      amenities: theatre.amenities?.join(', ') || '',
    });
    setTheatreModalOpen(true);
  };

  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...theatreForm,
        amenities: theatreForm.amenities.split(',').map((a) => a.trim()),
      };

      if (editingTheatre) {
        await adminAPI.updateTheatre(editingTheatre._id, payload);
        toast.success(`Theatre "${payload.name}" updated!`);
      } else {
        await adminAPI.createTheatre(payload);
        toast.success(`Theatre "${payload.name}" created!`);
      }

      setTheatreModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save theatre.');
    }
  };

  // ==================== SHOW SCHEDULING HANDLERS ====================
  const handleOpenShowCreate = () => {
    if (movies.length === 0 || theatres.length === 0) {
      toast.warning('Please create at least one movie and one theatre first.');
      return;
    }

    const defaultTheatre = theatres[0];
    setShowForm({
      movieId: movies[0]._id,
      theatreId: defaultTheatre._id,
      screenId: '',
      showDate: new Date().toISOString().split('T')[0],
      startTime: '07:00 PM',
      endTime: '09:45 PM',
      format: 'IMAX',
      language: 'English',
      vipPrice: 24,
      premiumPrice: 18,
      classicPrice: 13,
    });
    setShowModalOpen(true);
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      if (!showForm.screenId) {
        toast.warning('Please ensure this theatre has an active screen selected.');
        return;
      }

      const payload = {
        movieId: showForm.movieId,
        theatreId: showForm.theatreId,
        screenId: showForm.screenId,
        showDate: showForm.showDate,
        startTime: showForm.startTime,
        endTime: showForm.endTime,
        format: showForm.format,
        language: showForm.language,
        tierPricing: [
          { tierName: 'VIP Recliner', price: Number(showForm.vipPrice) },
          { tierName: 'Premium', price: Number(showForm.premiumPrice) },
          { tierName: 'Classic', price: Number(showForm.classicPrice) },
        ],
      };

      await adminAPI.createShow(payload);
      toast.success('Show scheduled successfully!');
      setShowModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule show.');
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Are you sure you want to deactivate this showtime?')) return;
    try {
      await adminAPI.deleteShow(showId);
      toast.success('Show cancelled / deactivated.');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to deactivate show.');
    }
  };

  // Filtered Bookings for Audit tab
  const filteredAuditBookings = allBookings.filter((b) => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.movieId?.title?.toLowerCase().includes(bookingSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (bookingStatusFilter !== 'All' && b.bookingStatus !== bookingStatusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              CineBook Admin Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cinema hall operations, catalog inventory, show scheduling & transaction auditing
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: Shield },
          { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
          { id: 'theatres', label: `Theatres (${theatres.length})`, icon: MapPin },
          { id: 'shows', label: `Shows (${shows.length})`, icon: Calendar },
          { id: 'bookings', label: `Bookings Audit (${allBookings.length})`, icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Gross Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Simulated INR Test Transactions
              </span>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-400" /> Total Bookings
              </span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {stats?.totalBookings || 0}
              </p>
              <span className="text-[10px] text-slate-400">
                {stats?.confirmedBookings || 0} confirmed passes
              </span>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-sky-400" /> Active Movies
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {stats?.totalMovies || 0}
              </p>
              <span className="text-[10px] text-slate-400">In current catalog</span>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" /> Registered Users
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {stats?.totalUsers || 0}
              </p>
              <span className="text-[10px] text-slate-400">Active accounts</span>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" /> Recent Bookings
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Movie</th>
                    <th className="pb-3">Seats</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400">{b.bookingId}</td>
                      <td className="py-3 text-white">{b.userId?.name || 'Guest'}</td>
                      <td className="py-3 text-slate-300">{b.movieId?.title || 'Movie'}</td>
                      <td className="py-3 font-mono text-slate-300">
                        {b.seats?.map((s) => s.seatNumber).join(', ')}
                      </td>
                      <td className="py-3 font-mono font-bold text-white">
                        ₹{b.pricingSummary?.totalAmount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MOVIES CRUD ==================== */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Movie Catalog Management</h3>
            <button
              onClick={handleOpenMovieCreate}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-black shadow-glow-gold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Movie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((m) => (
              <div
                key={m._id}
                className="glass-panel p-5 rounded-3xl border border-white/10 flex gap-4 shadow-xl relative"
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0"
                />
                <div className="space-y-1.5 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-amber-400 uppercase">
                      {m.certificate}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.duration}m</span>
                  </div>
                  <h4 className="font-bold text-white text-sm truncate">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{m.description}</p>
                  <p className="text-[10px] text-amber-300 font-semibold">{m.formats?.join(', ')}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenMovieEdit(m)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit Movie"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(m._id, m.title)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Deactivate Movie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: THEATRES CRUD ==================== */}
      {activeTab === 'theatres' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Multiplex Theatres Management</h3>
            <button
              onClick={handleOpenTheatreCreate}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-black shadow-glow-gold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Theatre
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theatres.map((t) => (
              <div
                key={t._id}
                className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                    {t.city}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenTheatreEdit(t)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white">{t.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {t.address}
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                  {t.amenities?.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/10"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SHOWS CRUD ==================== */}
      {activeTab === 'shows' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Showtimes & Scheduling</h3>
            <button
              onClick={handleOpenShowCreate}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-black shadow-glow-gold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Schedule New Show
            </button>
          </div>

          <div className="overflow-x-auto glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Movie</th>
                  <th className="pb-3">Theatre & Screen</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Booked Seats</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shows.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold text-white">{s.movieId?.title || 'Unknown Movie'}</td>
                    <td className="py-3 text-slate-300">
                      {s.theatreId?.name} ({s.screenId?.name})
                    </td>
                    <td className="py-3 text-slate-300">{s.showDate}</td>
                    <td className="py-3 font-mono font-bold text-amber-400">{s.startTime}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-300">
                        {s.format}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {s.bookedSeats?.length || 0} seats booked
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteShow(s._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Cancel Show"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BOOKINGS AUDIT ==================== */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-extrabold text-white">Platform Bookings Audit</h3>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ID, User, Movie..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="bg-cinema-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Movie</th>
                  <th className="pb-3">Theatre / Show</th>
                  <th className="pb-3">Seats</th>
                  <th className="pb-3">Paid Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuditBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-amber-400">{b.bookingId}</td>
                    <td className="py-3">
                      <p className="font-semibold text-white">{b.userId?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-500">{b.userId?.email}</p>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">{b.movieId?.title}</td>
                    <td className="py-3 text-slate-400">
                      {b.theatreId?.name} • {b.showId?.showDate} {b.showId?.startTime}
                    </td>
                    <td className="py-3 font-mono font-bold text-amber-300">
                      {b.seats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      ₹{b.pricingSummary?.totalAmount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== MODAL: MOVIE CREATE / EDIT ==================== */}
      {movieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie'}
              </h3>
              <button
                onClick={() => setMovieModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Synopsis / Description</label>
                <textarea
                  rows={3}
                  required
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Certificate</label>
                  <select
                    value={movieForm.certificate}
                    onChange={(e) => setMovieForm({ ...movieForm, certificate: e.target.value })}
                    className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'U/A', 'A'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Genres (comma-separated)</label>
                  <input
                    type="text"
                    value={movieForm.genres}
                    onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Formats (comma-separated)</label>
                  <input
                    type="text"
                    value={movieForm.formats}
                    onChange={(e) => setMovieForm({ ...movieForm, formats: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Poster URL</label>
                  <input
                    type="url"
                    required
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Backdrop URL</label>
                  <input
                    type="url"
                    required
                    value={movieForm.backdropUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">YouTube Trailer URL</label>
                <input
                  type="url"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-black shadow-glow-gold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THEATRE CREATE / EDIT ==================== */}
      {theatreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingTheatre ? `Edit Theatre: ${editingTheatre.name}` : 'Add New Multiplex'}
              </h3>
              <button
                onClick={() => setTheatreModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTheatre} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Theatre Name</label>
                <input
                  type="text"
                  required
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  placeholder="CineBook Prime IMAX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={theatreForm.city}
                    onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={theatreForm.phone}
                    onChange={(e) => setTheatreForm({ ...theatreForm, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={theatreForm.address}
                  onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                  placeholder="Street address..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={theatreForm.amenities}
                  onChange={(e) => setTheatreForm({ ...theatreForm, amenities: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTheatreModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-black shadow-glow-gold"
                >
                  Save Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: SCHEDULE SHOW ==================== */}
      {showModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Schedule New Movie Showtime</h3>
              <button
                onClick={() => setShowModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.duration}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Select Theatre</label>
                  <select
                    value={showForm.theatreId}
                    onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                    className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {theatres.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Select Screen</label>
                  <select
                    value={showForm.screenId}
                    onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })}
                    className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {availableScreens.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.screenType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Show Date</label>
                  <input
                    type="date"
                    required
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={showForm.startTime}
                    onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                    placeholder="07:00 PM"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={showForm.endTime}
                    onChange={(e) => setShowForm({ ...showForm, endTime: e.target.value })}
                    placeholder="09:45 PM"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">VIP Price (₹)</label>
                  <input
                    type="number"
                    value={showForm.vipPrice}
                    onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Premium Price (₹)</label>
                  <input
                    type="number"
                    value={showForm.premiumPrice}
                    onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Classic Price (₹)</label>
                  <input
                    type="number"
                    value={showForm.classicPrice}
                    onChange={(e) => setShowForm({ ...showForm, classicPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-black shadow-glow-gold"
                >
                  Schedule Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
