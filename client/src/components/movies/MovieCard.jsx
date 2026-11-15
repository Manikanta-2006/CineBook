import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-amber-500/40">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Certificate & Rating Overlays */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-white/10 uppercase">
            {movie.certificate || 'PG-13'}
          </span>
          {movie.formats?.[0] && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
              {movie.formats[0]}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 backdrop-blur-md text-amber-400 border border-white/10">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}</span>
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link
            to={`/movies/${movie._id}`}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-amber-400 to-amber-500 shadow-glow-gold hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Book Tickets
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {movie.duration}m
            </span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genres?.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">{movie.language}</span>
          <Link
            to={`/movies/${movie._id}`}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Details & Shows →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
