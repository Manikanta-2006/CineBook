import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, CreditCard, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cinema-900/90 border-t border-white/10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center">
                <Film className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                CineBook
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              CineBook delivers an ultra-smooth, premium dark cinematic movie ticket booking experience with real-time tiered seat selection, atomic concurrency guarantees, and instant digital e-tickets.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Concurrency Protected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <CreditCard className="w-3.5 h-3.5" /> Simulated Checkout
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Explore CineBook
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/movies" className="hover:text-amber-400 transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" className="hover:text-amber-400 transition-colors">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link to="/theatres" className="hover:text-amber-400 transition-colors">
                  Multiplex Theatres
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & System Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Platform Demo
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demonstration application powered by React, Tailwind CSS, Express, and MongoDB.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Demo Credentials:
              </div>
              <div>Admin: <code className="text-white">admin@cinebook.com</code></div>
              <div>User: <code className="text-white">user@cinebook.com</code></div>
              <div>Password: <code className="text-white">Admin@123 / User@123</code></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CineBook Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for cinema enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
