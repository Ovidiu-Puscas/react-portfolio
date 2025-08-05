import React from 'react';

const SelectionOptions = ({
  selectedYear,
  setSelectedYear,
  selectedCurrency,
  setSelectedCurrency,
}) => (
  <div className="flex flex-wrap justify-between gap-4 mb-6">
    <div className="input-item">
      <fieldset>
        <legend className="block text-gray-700 text-sm font-bold mb-2">Select Year:</legend>
        <div className="radio-group" data-testid="year-select">
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
      </fieldset>
    </div>
    <div className="input-item">
      <fieldset>
        <legend className="block text-gray-700 text-sm font-bold mb-2">
          Select Currency for All Values:
        </legend>
        <div className="radio-group" data-testid="currency-select">
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
      </fieldset>
    </div>
  </div>
);

export default SelectionOptions;
