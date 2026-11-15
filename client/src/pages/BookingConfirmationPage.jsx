import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, ArrowRight, Home } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import DigitalTicket from '../components/tickets/DigitalTicket';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingsAPI.getById(id);
          if (res.data?.booking) {
            setBooking(res.data.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-400">Retrieving confirmed ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center rounded-3xl bg-cinema-900 border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white">Booking Not Found</h3>
        <p className="text-xs text-slate-400">Could not locate ticket details.</p>
        <Link to="/movies" className="inline-block px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl">
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Your seats are reserved. Present this digital ticket at the auditorium entrance.
        </p>
      </div>

      {/* Digital Ticket */}
      <DigitalTicket booking={booking} />

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/my-bookings"
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4 text-amber-400" /> View All My Bookings
        </Link>
        <Link
          to="/movies"
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-glow-gold transition-all flex items-center justify-center gap-2"
        >
          <span>Explore More Movies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
