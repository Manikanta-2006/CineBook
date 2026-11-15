import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Film, MapPin, Calendar, Clock, Ticket, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import SimulatedPaymentTabs from '../components/checkout/SimulatedPaymentTabs';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { show, selectedSeats } = location.state || {};
  const [processing, setProcessing] = useState(false);

  // If user navigates directly without state, redirect
  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center rounded-3xl bg-cinema-900 border border-white/10 space-y-4">
        <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Active Reservation Found</h3>
        <p className="text-xs text-slate-400">
          Your seat selection session has expired or is invalid. Please select your seats again.
        </p>
        <Link
          to="/movies"
          className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black shadow-glow-gold"
        >
          Explore Movies
        </Link>
      </div>
    );
  }

  const movie = show.movieId || {};
  const theatre = show.theatreId || {};
  const screen = show.screenId || {};

  const subtotal = selectedSeats.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
  const convenienceFee = selectedSeats.length * 35; // ₹35 per seat
  const tax = Math.round(subtotal * 0.18); // 18% GST (9% CGST + 9% SGST)
  const totalAmount = subtotal + convenienceFee + tax;

  const handlePaymentComplete = async (paymentMethod) => {
    try {
      setProcessing(true);

      // Call Atomic Booking API
      const res = await bookingsAPI.create({
        showId: show._id,
        seats: selectedSeats,
        paymentMethod,
      });

      if (res.data?.success && res.data?.booking) {
        toast.success('Reservation confirmed successfully! Your digital e-ticket is ready.');
        navigate(`/booking-confirmation/${res.data.booking.bookingId}`, {
          state: { booking: res.data.booking },
        });
      }
    } catch (err) {
      console.error('Booking checkout error:', err);
      if (err.response?.status === 409) {
        // Concurrency Conflict Detected!
        toast.error(
          err.response?.data?.message ||
            'One or more selected seats have already been booked by another customer. Please choose different seats.'
        );
        // Redirect back to seat selection so they can choose fresh seats
        navigate(`/shows/${show._id}/seats`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to complete booking. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Back Link */}
      <div className="flex items-center gap-3">
        <Link
          to={`/shows/${show._id}/seats`}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Checkout & Simulated Payment
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review your order and complete booking with simulated test gateway
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" /> Order Summary
            </h3>

            {/* Movie Info */}
            <div className="flex items-center gap-4 pb-5 border-b border-white/10">
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0"
                />
              )}
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-400 uppercase">
                  {show.format || 'Standard'}
                </span>
                <h4 className="text-base font-extrabold text-white leading-tight">
                  {movie.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {theatre.name} • {screen.name}
                </p>
                <p className="text-xs text-amber-400 font-bold">
                  {show.showDate} at {show.startTime}
                </p>
              </div>
            </div>

            {/* Selected Seats List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Selected Seats ({selectedSeats.length})
              </span>
              <div className="space-y-2">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.seatNumber}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-300 font-mono">
                        {seat.seatNumber}
                      </span>
                      <span className="text-slate-400">({seat.tier})</span>
                    </div>
                    <span className="font-mono font-bold text-white">₹{seat.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee (₹35/seat)</span>
                <span className="font-mono text-white">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% Integrated)</span>
                <span className="font-mono text-white">₹{tax}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10 text-base font-extrabold text-white">
                <span>Total Payable</span>
                <span className="text-amber-400 font-mono text-xl">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Simulated Payment Form */}
        <div className="lg:col-span-7">
          <SimulatedPaymentTabs
            totalAmount={totalAmount}
            onComplete={handlePaymentComplete}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
