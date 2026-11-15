import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, MapPin, Calendar, Clock, Ticket, Copy, Check, Printer, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DigitalTicket = ({ booking }) => {
  const toast = useToast();
  const ticketRef = useRef(null);

  if (!booking) return null;

  const movie = booking.movieId || {};
  const theatre = booking.theatreId || {};
  const screen = booking.screenId || {};
  const show = booking.showId || {};

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.bookingId);
    toast.success('Booking ID copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const qrValue = booking.qrPayload || JSON.stringify({
    id: booking.bookingId,
    movie: movie.title,
    seats: booking.seats?.map((s) => s.seatNumber),
    theatre: theatre.name,
    verified: true,
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Printable / Viewable Ticket Card */}
      <div
        ref={ticketRef}
        className="relative bg-cinema-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl transition-all"
      >
        {/* Ticket Header Graphic */}
        <div className="relative h-32 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-6 flex items-start justify-between">
          <div className="z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-black/80 bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full">
              Official Cinema e-Ticket
            </span>
            <h2 className="text-2xl font-black text-black tracking-tight mt-1">
              CineBook Pass
            </h2>
          </div>

          <div className="z-10 text-right">
            <span className="text-[10px] uppercase font-bold text-black/70">Booking Ref</span>
            <div
              onClick={handleCopyId}
              className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-black bg-black/10 hover:bg-black/20 px-2 py-1 rounded-lg cursor-pointer transition-colors"
              title="Click to copy ID"
            >
              <span>{booking.bookingId}</span>
              <Copy className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Background watermark */}
          <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none">
            <Film className="w-36 h-36 text-black" />
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between px-3 -my-3 z-20">
          <div className="w-6 h-6 rounded-full bg-cinema-950 -ml-6 border border-white/10"></div>
          <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-cinema-950 -mr-6 border border-white/10"></div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Movie Details */}
          <div className="flex items-center gap-4">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
              />
            )}
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-400 border border-white/10 uppercase">
                {movie.certificate || 'PG-13'}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1 leading-snug">
                {movie.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {movie.duration} mins • {show.format || 'Standard'} • {show.language || 'English'}
              </p>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Theatre & Hall
              </span>
              <p className="font-semibold text-white mt-1 text-sm">{theatre.name}</p>
              <p className="text-slate-400 text-[11px]">{screen.name} ({theatre.city})</p>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Date & Time
              </span>
              <p className="font-semibold text-white mt-1 text-sm">{show.showDate}</p>
              <p className="text-amber-400 font-bold text-xs">{show.startTime}</p>
            </div>
          </div>

          {/* Seats & QR Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="w-full sm:w-auto space-y-2">
              <span className="text-slate-400 text-[11px] uppercase font-bold flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-amber-400" /> Reserved Seats
              </span>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats?.map((seat) => (
                  <span
                    key={seat.seatNumber}
                    className="px-3 py-1.5 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  >
                    {seat.seatNumber} ({seat.tier})
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Total Paid: <span className="text-white font-bold text-sm">₹{booking.pricingSummary?.totalAmount}</span>
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Confirmed • Test Transaction
              </span>
            </div>

            {/* Scannable QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
              <QRCodeSVG value={qrValue} size={105} level="H" />
              <span className="text-[9px] font-mono font-bold text-black mt-1">SCAN AT GATE</span>
            </div>
          </div>

          {/* Decorative Barcode */}
          <div className="pt-4 border-t border-white/10 flex flex-col items-center justify-center">
            <div className="h-9 w-full max-w-xs flex items-center justify-between opacity-50 px-2">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-white ${
                    i % 4 === 0 ? 'w-1.5' : i % 3 === 0 ? 'w-1' : 'w-0.5'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1">
              AUTH-CODE: {booking.paymentDetails?.transactionId || 'TXN-MOCK'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-amber-400" /> Print Ticket
        </button>
      </div>
    </div>
  );
};

export default DigitalTicket;
