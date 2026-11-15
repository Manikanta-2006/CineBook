import React from 'react';
import SeatItem from './SeatItem';

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const SeatGrid = ({
  seatLayout = {},
  tierPricing = [],
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
}) => {
  const totalRows = seatLayout.totalRows || 8;
  const totalCols = seatLayout.totalCols || 12;
  const aisleColumns = seatLayout.aisleColumns || [4, 8];
  const tiers = seatLayout.tiers || [
    { name: 'VIP Recliner', rows: ['A', 'B'] },
    { name: 'Premium', rows: ['C', 'D', 'E'] },
    { name: 'Classic', rows: ['F', 'G', 'H'] },
  ];

  // Helper to get tier name and price for a given row letter
  const getRowTierInfo = (rowLetter) => {
    let tierName = 'Standard';
    for (const t of tiers) {
      if (t.rows && t.rows.includes(rowLetter)) {
        tierName = t.name;
        break;
      }
    }

    const priceObj = tierPricing.find(
      (tp) => tp.tierName.toLowerCase() === tierName.toLowerCase()
    );
    const price = priceObj ? priceObj.price : 15;

    return { tierName, price };
  };

  const rows = ROW_LETTERS.slice(0, totalRows);
  const selectedSeatCodes = new Set(selectedSeats.map((s) => s.seatNumber));
  const bookedSeatCodes = new Set(bookedSeats);

  // Group rows by tier for clear section headers
  let lastTier = '';

  return (
    <div className="w-full overflow-x-auto py-6 flex flex-col items-center">
      <div className="min-w-fit px-4 space-y-3">
        {rows.map((rowLetter) => {
          const { tierName, price } = getRowTierInfo(rowLetter);
          const isNewTierHeader = tierName !== lastTier;
          if (isNewTierHeader) {
            lastTier = tierName;
          }

          return (
            <React.Fragment key={rowLetter}>
              {/* Tier Section Header */}
              {isNewTierHeader && (
                <div className="pt-4 pb-2 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="uppercase tracking-wider text-amber-400/90">{tierName}</span>
                  <span className="text-slate-300 font-mono">₹{price} / ticket</span>
                </div>
              )}

              {/* Row Grid */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Left Row Label */}
                <div className="w-6 text-center text-xs font-bold text-slate-400 select-none">
                  {rowLetter}
                </div>

                {/* Seats with walking aisles */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: totalCols }, (_, colIdx) => {
                    const colNum = colIdx + 1;
                    const seatNumber = `${rowLetter}${colNum}`;
                    const isBooked = bookedSeatCodes.has(seatNumber);
                    const isSelected = selectedSeatCodes.has(seatNumber);
                    const isAisle = aisleColumns.includes(colNum);

                    const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available';

                    return (
                      <React.Fragment key={seatNumber}>
                        <SeatItem
                          seatNumber={seatNumber}
                          status={status}
                          tier={tierName}
                          price={price}
                          onToggle={onSeatToggle}
                        />
                        {/* Aisle Walking Gap */}
                        {isAisle && <div className="w-4 sm:w-6 pointer-events-none" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Row Label */}
                <div className="w-6 text-center text-xs font-bold text-slate-400 select-none">
                  {rowLetter}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SeatGrid;
