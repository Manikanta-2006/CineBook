import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Ticket, ShieldCheck, AlertCircle } from 'lucide-react';
import { showsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import CinemaScreenView from '../components/seats/CinemaScreenView';
import SeatGrid from '../components/seats/SeatGrid';
import SeatLegend from '../components/seats/SeatLegend';

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await showsAPI.getById(showId);
        if (res.data?.show) {
          setShow(res.data.show);
        }
      } catch (err) {
        toast.error('Failed to load show details. It may be inactive or expired.');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId, navigate]);

  const handleSeatToggle = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatNumber === seat.seatNumber);
      if (exists) {
        return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      } else {
        if (prev.length >= 8) {
          toast.warning('Maximum 8 seats allowed per single booking transaction.');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat to continue.');
      return;
    }

    // Pass show and selectedSeats to Checkout page via location state
    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-400">Loading interactive cinema hall...</p>
      </div>
    );
  }

  if (!show) return null;

  const movie = show.movieId || {};
  const theatre = show.theatreId || {};
  const screen = show.screenId || {};
  const subtotal = selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);

  return (
    <div className="min-h-screen pb-32">
      {/* Top Header Bar */}
      <div className="glass-panel border-b border-white/10 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/movies/${movie._id}`}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>{movie.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-400 border border-white/10">
                  {show.format}
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> {theatre.name} ({screen.name})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" /> {show.showDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Clock className="w-3 h-3 text-amber-400" /> {show.startTime}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Atomic Concurrency Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Seat Map Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cinema Curved Screen */}
        <CinemaScreenView screenName={screen.name} screenType={screen.screenType} />

        {/* Interactive Grid */}
        <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center">
          <SeatGrid
            seatLayout={screen.seatLayout}
            tierPricing={show.tierPricing}
            bookedSeats={show.bookedSeats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />

          {/* Legend */}
          <div className="w-full mt-8 pt-6 border-t border-white/10">
            <SeatLegend />
          </div>
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/15 backdrop-blur-2xl py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Selected Seats ({selectedSeats.length}/8)
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 min-h-[28px]">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => (
                    <span
                      key={s.seatNumber}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-500 text-black shadow-glow-gold"
                    >
                      {s.seatNumber}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No seats selected yet</span>
                )}
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="pl-4 border-l border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Subtotal
                </span>
                <p className="text-xl font-extrabold text-amber-400 font-mono">
                  ₹{subtotal}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-glow-gold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-98"
            >
              <Ticket className="w-4 h-4" /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
