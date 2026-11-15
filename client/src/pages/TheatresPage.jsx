import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Award, Film, ChevronRight } from 'lucide-react';
import { theatresAPI } from '../services/api';

const TheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [theatresRes, citiesRes] = await Promise.all([
          theatresAPI.getAll(selectedCity !== 'All' ? { city: selectedCity } : {}),
          theatresAPI.getCities(),
        ]);

        if (theatresRes.data?.theatres) {
          setTheatres(theatresRes.data.theatres);
        }
        if (citiesRes.data?.cities) {
          setCities(citiesRes.data.cities);
        }
      } catch (err) {
        console.error('Failed to load theatres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          CineBook Multiplex Theatres
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore world-class luxury auditoriums equipped with IMAX Laser and spatial Dolby Atmos sound
        </p>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCity('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCity === 'All'
              ? 'bg-amber-500 text-black shadow-glow-gold'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          All Cities
        </button>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCity === city
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Theatres Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-cinema-900 animate-pulse" />
          ))}
        </div>
      ) : theatres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theatres.map((t) => (
            <div
              key={t._id}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                    {t.city}
                  </span>
                  {t.phone && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {t.phone}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {t.address}
                </p>
              </div>

              {/* Amenities */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Hall Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 flex justify-end">
                <Link
                  to={`/movies`}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
                >
                  <span>Browse Current Shows</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-cinema-900/50 border border-white/10 space-y-3">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No theatres found</h3>
          <p className="text-xs text-slate-400">Try selecting another city filter.</p>
        </div>
      )}
    </div>
  );
};

export default TheatresPage;
