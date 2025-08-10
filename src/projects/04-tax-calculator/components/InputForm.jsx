import React from 'react';

const InputForm = ({
  customRate,
  setCustomRate,
  usdToRonRate,
  setUsdToRonRate,
  ronToEurRate,
  setRonToEurRate,
  microSrlTaxRate,
  setMicroSrlTaxRate,
  nextYearDividendTaxRate,
  setNextYearDividendTaxRate,
  selectedYear,
  setSelectedYear,
  selectedCurrency,
  setSelectedCurrency,
  isLoadingRates,
  lastUpdated,
  apiError,
}) => (
  <div className="space-y-5">
    {/* Hourly Rate Input */}
    <div className="group">
      <label
        htmlFor="customRate"
        className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block"
      >
        Hourly Rate
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
        <input
          type="number"
          id="customRate"
          data-testid="income-input"
          placeholder="25.00"
          min="0"
          step="0.01"
          value={customRate}
          onChange={(e) => setCustomRate(e.target.value)}
          className="pl-8 pr-4"
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">Enter your hourly rate in USD</p>
    </div>

    {/* Year & Currency Selection */}
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
          Tax Year
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedYear('2025')}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedYear === '2025'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                : 'bg-white/50 text-slate-700 hover:bg-white/70 border border-slate-200/50'
            }`}
          >
            2025
          </button>
          <button
            onClick={() => setSelectedYear('2026')}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedYear === '2026'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                : 'bg-white/50 text-slate-700 hover:bg-white/70 border border-slate-200/50'
            }`}
          >
            2026
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
          Display Currency
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['USD', 'RON', 'EUR'].map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedCurrency === currency
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                  : 'bg-white/50 text-slate-700 hover:bg-white/70 border border-slate-200/50'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Exchange Rates Section */}
    <div className="pt-4 border-t border-slate-200/50">
      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
        Exchange Rates
      </h4>
      <div className="space-y-3">
        <div>
          <label htmlFor="usdToRonRate" className="text-xs text-slate-600 mb-1 block">
            USD → RON
          </label>
          <input
            type="number"
            id="usdToRonRate"
            value={usdToRonRate}
            onChange={(e) => setUsdToRonRate(e.target.value)}
            min="0"
            step="0.001"
            disabled={isLoadingRates}
          />
        </div>
        <div>
          <label htmlFor="ronToEurRate" className="text-xs text-slate-600 mb-1 block">
            EUR → RON
          </label>
          <input
            type="number"
            id="ronToEurRate"
            value={ronToEurRate}
            onChange={(e) => setRonToEurRate(e.target.value)}
            min="0"
            step="0.001"
            disabled={isLoadingRates}
          />
        </div>
      </div>
    </div>

    {/* Tax Rates Section */}
    <div className="pt-4 border-t border-slate-200/50">
      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
        Tax Configuration
      </h4>
      <div className="space-y-3">
        <div>
          <label htmlFor="microSrlTaxRate" className="text-xs text-slate-600 mb-1 block">
            Micro SRL Tax Rate (%)
          </label>
          <select
            id="microSrlTaxRate"
            value={microSrlTaxRate}
            onChange={(e) => setMicroSrlTaxRate(e.target.value)}
          >
            <option value="1">1% (no employees)</option>
            <option value="3">3% (with employees)</option>
          </select>
        </div>
        <div>
          <label htmlFor="nextYearDividendTaxRate" className="text-xs text-slate-600 mb-1 block">
            2026 Dividend Tax (%)
          </label>
          <input
            type="number"
            id="nextYearDividendTaxRate"
            value={nextYearDividendTaxRate}
            onChange={(e) => setNextYearDividendTaxRate(e.target.value)}
            min="0"
            max="100"
            step="1"
          />
        </div>
      </div>
    </div>
  </div>
);

export default InputForm;
