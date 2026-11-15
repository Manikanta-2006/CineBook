import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, MapPin, User, LogOut, Shield, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { theatresAPI } from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [cities, setCities] = useState([
    'Mumbai',
    'Delhi-NCR',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
  ]);
  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem('cinebook_city') || 'Mumbai'
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await theatresAPI.getCities();
        if (res.data?.cities?.length > 0) {
          setCities(res.data.cities);
        }
      } catch (err) {
        console.warn('Could not fetch cities, using defaults');
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    localStorage.setItem('cinebook_city', city);
    window.dispatchEvent(new Event('city_changed'));
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform duration-300">
            <Film className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
              CineBook
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-400/90 -mt-1">
              Cinema Reimagined
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/movies"
            className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
              isActiveLink('/movies') ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Film className="w-4 h-4" /> Movies
          </Link>

          <Link
            to="/theatres"
            className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
              isActiveLink('/theatres') ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <MapPin className="w-4 h-4" /> Theatres
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className={`text-sm font-medium transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
                isActiveLink('/my-bookings') ? 'text-amber-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Ticket className="w-4 h-4" /> My Tickets
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin') ? 'ring-2 ring-amber-400' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" /> Admin Console
            </Link>
          )}
        </nav>

        {/* Right Section: City Picker & User Profile / Login */}
        <div className="hidden md:flex items-center gap-5">
          {/* City Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:border-amber-400/40 transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </div>

            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-cinema-900 border border-white/10 shadow-2xl p-1.5 hidden group-hover:block transition-all z-50">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5">
                Select City
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedCity === city
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile or Login Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-cinema-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 z-50"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" /> My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-200 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-4 py-2.5 rounded-xl shadow-glow-gold transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cinema-900 border-b border-white/10 px-4 pt-3 pb-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400">Current City:</span>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-white/10 text-xs text-white rounded-lg px-2 py-1 outline-none border border-white/20"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-cinema-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Movies
          </Link>
          <Link
            to="/theatres"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Theatres
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-200 py-1.5"
              >
                My Tickets
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-amber-400 py-1.5"
                >
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block text-sm font-medium text-rose-400 py-1.5 text-left w-full"
              >
                Sign Out ({user.name})
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold text-white bg-white/10 py-2.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-bold text-black bg-amber-400 py-2.5 rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
