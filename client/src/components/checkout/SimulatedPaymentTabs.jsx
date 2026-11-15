import React, { useState } from 'react';
import { CreditCard, QrCode, Zap, ShieldCheck, Lock, CheckCircle2, Building2 } from 'lucide-react';

const SimulatedPaymentTabs = ({ totalAmount, onComplete, processing }) => {
  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('6521 •••• •••• 8842'); // RuPay / Visa
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('841');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleSubmit = (e) => {
    e.preventDefault();
    let methodName = 'Simulated UPI';
    if (method === 'upi') {
      methodName = `Simulated UPI (${upiApp.toUpperCase()} - ${upiId})`;
    } else if (method === 'card') {
      methodName = 'Simulated RuPay/Debit Card';
    } else if (method === 'netbanking') {
      methodName = `Simulated NetBanking (${selectedBank})`;
    } else {
      methodName = 'Simulated 1-Click Fast Checkout';
    }

    onComplete(methodName);
  };

  return (
    <div className="rounded-3xl bg-cinema-900/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Payment Method (India)</h3>
          <p className="text-xs text-slate-400">Choose a simulated Indian payment gateway to finalize</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Simulated Gateway
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setMethod('upi')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold transition-all ${
            method === 'upi'
              ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" /> UPI
        </button>

        <button
          type="button"
          onClick={() => setMethod('card')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold transition-all ${
            method === 'card'
              ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Card
        </button>

        <button
          type="button"
          onClick={() => setMethod('netbanking')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold transition-all ${
            method === 'netbanking'
              ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> NetBank
        </button>

        <button
          type="button"
          onClick={() => setMethod('instant')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold transition-all ${
            method === 'instant'
              ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> 1-Click
        </button>
      </div>

      {/* Simulated Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Simulated Indian Payment Mode: </span>
          All UPI IDs, RuPay cards, and NetBanking selections will auto-authorize in sandbox test mode. No actual INR charges will occur.
        </div>
      </div>

      {/* Form Content based on active tab */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {method === 'upi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select UPI App
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gpay', name: 'Google Pay' },
                  { id: 'phonepe', name: 'PhonePe' },
                  { id: 'paytm', name: 'Paytm' },
                  { id: 'bhim', name: 'BHIM UPI' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setUpiApp(app.id)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                      upiApp === app.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Virtual Payment Address (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="mobileNumber@upi or user@okhdfcbank"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        )}

        {method === 'card' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Card Number (RuPay, Visa, Mastercard)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="6521 •••• •••• 8842"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Primary Indian Bank
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBank(b)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    selectedBank === b
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {method === 'instant' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
            <Zap className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Instant 1-Click Fast Checkout</h4>
            <p className="text-xs text-slate-400">
              Skip typing bank credentials and confirm your Indian cinema pass immediately.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-glow-gold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Simulated Indian Payment...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Pay ₹{totalAmount}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SimulatedPaymentTabs;
