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
  isLoadingRates,
  lastUpdated,
  apiError,
}) => (
  <div className="input-group">
    <div className="input-item">
      <label htmlFor="customRate" className="block text-gray-700 text-sm font-bold mb-2">
        Enter Custom <br />
        Hourly Rate ($):
      </label>
      <input
        type="number"
        id="customRate"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="e.g., 27.50"
        min="0"
        step="0.01"
        value={customRate}
        onChange={(e) => setCustomRate(e.target.value)}
      />
    </div>
    <div className="input-item">
      <label htmlFor="usdToRonRate" className="block text-gray-700 text-sm font-bold mb-2">
        USD to RON <br />
        Exchange Rate:
        {lastUpdated && !apiError && <span className="text-green-600 text-xs ml-2">(Live)</span>}
        {apiError && <span className="text-orange-600 text-xs ml-2">(Default)</span>}
      </label>
      <input
        type="number"
        id="usdToRonRate"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={usdToRonRate}
        onChange={(e) => setUsdToRonRate(e.target.value)}
        min="0"
        step="0.001"
        disabled={isLoadingRates}
      />
      {isLoadingRates && <div className="text-blue-600 text-xs mt-1">Loading...</div>}
    </div>
    <div className="input-item">
      <label htmlFor="ronToEurRate" className="block text-gray-700 text-sm font-bold mb-2">
        EUR to RON <br />
        Exchange Rate:
        {lastUpdated && !apiError && <span className="text-green-600 text-xs ml-2">(Live)</span>}
        {apiError && <span className="text-orange-600 text-xs ml-2">(Default)</span>}
      </label>
      <input
        type="number"
        id="ronToEurRate"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={ronToEurRate}
        onChange={(e) => setRonToEurRate(e.target.value)}
        min="0"
        step="0.001"
        disabled={isLoadingRates}
      />
      {isLoadingRates && <div className="text-blue-600 text-xs mt-1">Loading...</div>}
    </div>
    <div className="input-item">
      <label htmlFor="microSrlTaxRate" className="block text-gray-700 text-sm font-bold mb-2">
        Micro SRL <br />
        Tax Rate (%):
      </label>
      <input
        type="number"
        id="microSrlTaxRate"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={microSrlTaxRate}
        onChange={(e) => setMicroSrlTaxRate(e.target.value)}
        min="1"
        max="3"
        step="1"
      />
    </div>
    <div className="input-item">
      <label
        htmlFor="nextYearDividendTaxRate"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        2026 Dividend <br />
        Tax Rate (%):
      </label>
      <input
        type="number"
        id="nextYearDividendTaxRate"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={nextYearDividendTaxRate}
        onChange={(e) => setNextYearDividendTaxRate(e.target.value)}
        min="0"
        step="1"
      />
    </div>
  </div>
);

export default InputForm;
