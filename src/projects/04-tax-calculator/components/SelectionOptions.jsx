import React from 'react';

const SelectionOptions = ({
  selectedYear,
  setSelectedYear,
  selectedCurrency,
  setSelectedCurrency
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 mb-6">
      <div className="input-item">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Year:
        </label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="selectedYear"
              value="2025"
              checked={selectedYear === '2025'}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            2025
          </label>
          <label>
            <input
              type="radio"
              name="selectedYear"
              value="2026"
              checked={selectedYear === '2026'}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            2026
          </label>
        </div>
      </div>
      <div className="input-item">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Currency for All Values:
        </label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="selectedCurrency"
              value="USD"
              checked={selectedCurrency === 'USD'}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            />
            USD
          </label>
          <label>
            <input
              type="radio"
              name="selectedCurrency"
              value="RON"
              checked={selectedCurrency === 'RON'}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            />
            RON
          </label>
          <label>
            <input
              type="radio"
              name="selectedCurrency"
              value="EUR"
              checked={selectedCurrency === 'EUR'}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            />
            EUR
          </label>
        </div>
      </div>
    </div>
  );
};

export default SelectionOptions;
