import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, X, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import DigitalTicket from '../components/tickets/DigitalTicket';

const UserBookingsPage = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMyBookings();
      if (res.data?.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      toast.error('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The reserved seats will be released immediately.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await bookingsAPI.cancel(bookingId);
      if (res.data?.success) {
        toast.success('Booking cancelled successfully. Seats released back to the auditorium.');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          My Bookings & Tickets
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your upcoming and past cinema reservations, view scannable digital tickets or cancel tickets
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-cinema-900 animate-pulse" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const movie = booking.movieId || {};
            const theatre = booking.theatreId || {};
            const screen = booking.screenId || {};
            const show = booking.showId || {};
            const isConfirmed = booking.bookingStatus === 'CONFIRMED';

            return (
              <div
                key={booking._id}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl transition-all hover:border-white/20"
              >
                {/* Left: Movie poster & main info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-amber-400">
                        {booking.bookingId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isConfirmed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {theatre.name} • {screen.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" /> {show.showDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> {show.startTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Seats chips & price */}
                <div className="flex flex-col md:items-center space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Reserved Seats ({booking.seats?.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.seats?.map((s) => (
                      <span
                        key={s.seatNumber}
                        className="px-2.5 py-1 rounded-lg text-xs font-black bg-white/5 border border-white/10 text-amber-300 font-mono"
                      >
                        {s.seatNumber}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    Total: <strong className="text-white font-mono">₹{booking.pricingSummary?.totalAmount}</strong>
                  </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {isConfirmed && (
                    <button
                      onClick={() => setSelectedTicket(booking)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" /> View Ticket
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelBooking(booking.bookingId)}
                      disabled={cancellingId === booking.bookingId}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-all disabled:opacity-50"
                    >
                      {cancellingId === booking.bookingId ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-cinema-900/50 border border-white/10 space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No bookings yet</h3>
          <p className="text-xs text-slate-400">You haven't booked any movie tickets yet.</p>
          <Link
            to="/movies"
            className="inline-block mt-3 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black shadow-glow-gold"
          >
            Browse Movies & Book Now
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="relative w-full max-w-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-4 -right-4 z-50 p-2 rounded-full bg-cinema-900 text-white border border-white/20 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <DigitalTicket booking={selectedTicket} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
