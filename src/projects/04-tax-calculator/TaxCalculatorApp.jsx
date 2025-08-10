import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import InputForm from './components/InputForm';
import SelectionOptions from './components/SelectionOptions';
import ResultsTable from './components/ResultsTable';
import Disclaimer from './components/Disclaimer';
import { fetchExchangeRates, getDefaultRates } from './services/currencyService';
import ErrorFallback from '../../components/ErrorFallback';
import { logError } from '../../utils/errorLogger';
import './TaxCalculator.css';

// Lazy load chart components for better performance
const IncomeComparisonChart = lazy(() => import('./components/charts/IncomeComparisonChart'));
const TaxBreakdownChart = lazy(() => import('./components/charts/TaxBreakdownChart'));
const RateProgressionChart = lazy(() => import('./components/charts/RateProgressionChart'));
const CurrencyComparisonChart = lazy(() => import('./components/charts/CurrencyComparisonChart'));
const YearComparisonChart = lazy(() => import('./components/charts/YearComparisonChart'));

const TaxCalculatorApp = () => {
  // Constants for calculations
  const HOURS_PER_MONTH = 160;
  const MIN_WAGE_2025 = 4050; // RON for 2025
  const MIN_WAGE_2026 = 4050; // RON for 2026 (using 2025 value as placeholder)

  // State management
  const [customRate, setCustomRate] = useState('');
  const [usdToRonRate, setUsdToRonRate] = useState('4.37');
  const [ronToEurRate, setRonToEurRate] = useState('5.07');
  const [microSrlTaxRate, setMicroSrlTaxRate] = useState('3');
  const [nextYearDividendTaxRate, setNextYearDividendTaxRate] = useState('16');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Chart view states
  const [activeChart, setActiveChart] = useState(null);
  const [highlightedRate, setHighlightedRate] = useState(null);

  // Currency API states
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      setIsLoadingRates(true);
      setApiError(null);

      try {
        const rates = await fetchExchangeRates();

        if (rates.success) {
          setUsdToRonRate(rates.usdToRon);
          setRonToEurRate(rates.eurToRon);
          setLastUpdated(rates.lastUpdated);
        } else {
          // Use default rates if API fails
          const defaultRates = getDefaultRates();
          setUsdToRonRate(defaultRates.usdToRon);
          setRonToEurRate(defaultRates.eurToRon);
          setApiError(rates.error);
        }
      } catch (error) {
        console.error('Error loading exchange rates:', error);
        const defaultRates = getDefaultRates();
        setUsdToRonRate(defaultRates.usdToRon);
        setRonToEurRate(defaultRates.eurToRon);
        setApiError('Failed to load exchange rates');
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadExchangeRates();
  }, []);

  // Function to refresh exchange rates
  const refreshRates = async () => {
    setIsLoadingRates(true);
    setApiError(null);

    try {
      const rates = await fetchExchangeRates();

      if (rates.success) {
        setUsdToRonRate(rates.usdToRon);
        setRonToEurRate(rates.eurToRon);
        setLastUpdated(rates.lastUpdated);
      } else {
        setApiError(rates.error);
      }
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
      setApiError('Failed to refresh exchange rates');
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Function to calculate CASS based on annual income and thresholds
  const calculateCASS = (annualIncomeRON, minWage) => {
    const threshold6 = 6 * minWage;
    const threshold12 = 12 * minWage;
    const threshold24 = 24 * minWage;

    let taxableBaseAnnual = 0;
    if (annualIncomeRON >= threshold24) {
      taxableBaseAnnual = threshold24;
    } else if (annualIncomeRON >= threshold12) {
      taxableBaseAnnual = threshold12;
    } else if (annualIncomeRON >= threshold6) {
      taxableBaseAnnual = threshold6;
    } else {
      // Below 6 minimum wages, no CASS for dividends
      taxableBaseAnnual = 0;
    }

    const annualCASS = taxableBaseAnnual * 0.1; // 10% CASS rate
    return annualCASS / 12; // Return monthly CASS
  };

  // Function to calculate income and taxes for Micro SRL
  const calculateIncome = (
    hourlyRate,
    usdToRonRate,
    eurToRonRate,
    microSrlTaxRate,
    nextYearDividendTaxRate
  ) => {
    const grossMonthlyUSD = hourlyRate * HOURS_PER_MONTH;
    const grossMonthlyRON = grossMonthlyUSD * usdToRonRate;

    // --- 2025 Calculations (Micro SRL) ---
    // Company Level Tax (Micro SRL Turnover Tax)
    const companyTax2025RON = grossMonthlyRON * (microSrlTaxRate / 100);
    const companyNet2025RON = grossMonthlyRON - companyTax2025RON;
    const companyNet2025USD = companyNet2025RON / usdToRonRate;
    const companyNet2025Eur = companyNet2025RON / eurToRonRate;

    // Individual Level Taxes (on Dividends from 2025 Profit)
    const dividendTax2025 = companyNet2025RON * 0.1; // 10% dividend tax for 2025
    const cassIndividual2025 = calculateCASS(companyNet2025RON * 12, MIN_WAGE_2025); // CASS on dividends
    const individualTaxes2025RON = dividendTax2025 + cassIndividual2025;
    const individualNet2025RON = companyNet2025RON - individualTaxes2025RON;
    const individualNet2025USD = individualNet2025RON / usdToRonRate;
    const individualNet2025Eur = individualNet2025RON / eurToRonRate;

    // --- 2026 Calculations (Micro SRL & Dividend) ---
    // Company Level Tax (Micro SRL Turnover Tax) - Assuming same rate for 2026
    const companyTax2026RON = grossMonthlyRON * (microSrlTaxRate / 100);
    const companyNet2026RON = grossMonthlyRON - companyTax2026RON;
    const companyNet2026USD = companyNet2026RON / usdToRonRate;
    const companyNet2026Eur = companyNet2026RON / eurToRonRate;

    // Individual Level Taxes (on Dividends from 2026 Profit)
    const dividendTax2026 = companyNet2026RON * (nextYearDividendTaxRate / 100); // Configurable dividend tax for 2026
    const cassIndividual2026 = calculateCASS(companyNet2026RON * 12, MIN_WAGE_2026); // CASS on dividends (using 2026 placeholder min wage)
    const individualTaxes2026DividendRON = dividendTax2026 + cassIndividual2026;
    const individualNet2026DividendRON = companyNet2026RON - individualTaxes2026DividendRON;
    const individualNet2026DividendUSD = individualNet2026DividendRON / usdToRonRate;
    const individualNet2026DividendEur = individualNet2026DividendRON / eurToRonRate;

    return {
      hourlyRate,
      grossMonthlyUSD,
      grossMonthlyRON,
      grossMonthlyEur: grossMonthlyRON / eurToRonRate,

      companyNet2025USD,
      companyNet2025RON,
      companyNet2025Eur,
      companyTax2025RON,
      individualNet2025USD,
      individualTaxes2025RON,
      individualNet2025RON,
      individualNet2025Eur,

      companyNet2026USD,
      companyNet2026RON,
      companyNet2026Eur,
      companyTax2026RON,
      individualNet2026DividendUSD,
      individualTaxes2026DividendRON,
      individualNet2026DividendRON,
      individualNet2026DividendEur,
    };
  };

  // Function to format numbers as currency
  const formatCurrency = (amount, currencySymbol = '$') => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return `${currencySymbol}0.00`;
    }
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        logError(error, errorInfo, { component: 'TaxCalculatorApp' });
      }}
    >
      <div className="tax-calculator-container">
        {/* Main Layout Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Liquid Glass Side Panel - Collapsible on Mobile */}
          <div className="lg:col-span-1">
            <div className="liquid-glass-panel lg:sticky lg:top-0">
              {/* Panel Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg">⚙️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Configuration</h3>
                  <p className="text-xs text-slate-500">Adjust parameters</p>
                </div>
              </div>

              {/* Exchange Rate Status */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/50 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Exchange Rates
                  </span>
                  {isLoadingRates && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  {lastUpdated && !isLoadingRates && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {lastUpdated && (
                  <div className="text-xs text-slate-600 mb-2">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </div>
                )}

                <button
                  onClick={refreshRates}
                  disabled={isLoadingRates}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 hover:bg-white/70 disabled:bg-gray-100/50 text-slate-700 font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 border border-slate-200/50"
                >
                  {isLoadingRates ? 'Refreshing...' : 'Refresh Rates'}
                </button>
              </div>

              <InputForm
                customRate={customRate}
                setCustomRate={setCustomRate}
                usdToRonRate={usdToRonRate}
                setUsdToRonRate={setUsdToRonRate}
                ronToEurRate={ronToEurRate}
                setRonToEurRate={setRonToEurRate}
                microSrlTaxRate={microSrlTaxRate}
                setMicroSrlTaxRate={setMicroSrlTaxRate}
                nextYearDividendTaxRate={nextYearDividendTaxRate}
                setNextYearDividendTaxRate={setNextYearDividendTaxRate}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                isLoadingRates={isLoadingRates}
                lastUpdated={lastUpdated}
                apiError={apiError}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            {/* Visualization Controls */}
            <div className="p-3 lg:p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-3 lg:mb-4 flex items-center gap-2">
                <span className="text-base lg:text-xl">📊</span> Visual Analytics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                <button
                  onClick={() => setActiveChart(activeChart === 'income' ? null : 'income')}
                  className={`px-4 py-3 lg:px-6 lg:py-4 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 ${
                    activeChart === 'income'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg lg:transform lg:scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200'
                  }`}
                >
                  <span className="hidden sm:inline">📊</span> Income Comparison
                </button>
                <button
                  onClick={() => setActiveChart(activeChart === 'year' ? null : 'year')}
                  className={`px-4 py-3 lg:px-6 lg:py-4 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 ${
                    activeChart === 'year'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg lg:transform lg:scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200'
                  }`}
                >
                  <span className="hidden sm:inline">📅</span> Year Comparison
                </button>
              </div>
            </div>

            {/* Chart Display Area */}
            {activeChart && (
              <Suspense
                fallback={
                  <div className="w-full bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading chart...</p>
                  </div>
                }
              >
                {activeChart === 'income' && (
                  <IncomeComparisonChart
                    customRate={parseFloat(customRate)}
                    usdToRonRate={parseFloat(usdToRonRate)}
                    ronToEurRate={parseFloat(ronToEurRate)}
                    microSrlTaxRate={parseFloat(microSrlTaxRate)}
                    nextYearDividendTaxRate={parseFloat(nextYearDividendTaxRate)}
                    selectedYear={selectedYear}
                    selectedCurrency={selectedCurrency}
                    calculateIncome={calculateIncome}
                    onRateClick={setHighlightedRate}
                  />
                )}
                {activeChart === 'year' && (
                  <YearComparisonChart
                    customRate={parseFloat(customRate)}
                    usdToRonRate={parseFloat(usdToRonRate)}
                    ronToEurRate={parseFloat(ronToEurRate)}
                    microSrlTaxRate={parseFloat(microSrlTaxRate)}
                    nextYearDividendTaxRate={parseFloat(nextYearDividendTaxRate)}
                    selectedCurrency={selectedCurrency}
                    calculateIncome={calculateIncome}
                  />
                )}
              </Suspense>
            )}

            {/* Main Results Dashboard - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Tax Breakdown Widget - Full Width on Mobile */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-4 lg:p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800">Tax Breakdown</h3>
                  </div>
                  <TaxBreakdownChart
                    hourlyRate={parseFloat(customRate) || 25}
                    usdToRonRate={parseFloat(usdToRonRate)}
                    ronToEurRate={parseFloat(ronToEurRate)}
                    microSrlTaxRate={parseFloat(microSrlTaxRate)}
                    nextYearDividendTaxRate={parseFloat(nextYearDividendTaxRate)}
                    selectedYear={selectedYear}
                    selectedCurrency={selectedCurrency}
                    calculateIncome={calculateIncome}
                  />
                </div>
              </div>

              {/* Results Table - Priority on Mobile */}
              <div className="lg:col-span-2 order-1 lg:order-2" data-testid="tax-results">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-4 lg:p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      <h3 className="text-base lg:text-lg font-bold text-slate-800">
                        Income Calculator Results
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 lg:p-6 overflow-x-auto">
                    <ResultsTable
                      selectedYear={selectedYear}
                      selectedCurrency={selectedCurrency}
                      customRate={parseFloat(customRate)}
                      usdToRonRate={parseFloat(usdToRonRate)}
                      ronToEurRate={parseFloat(ronToEurRate)}
                      microSrlTaxRate={parseFloat(microSrlTaxRate)}
                      nextYearDividendTaxRate={parseFloat(nextYearDividendTaxRate)}
                      calculateIncome={calculateIncome}
                      formatCurrency={formatCurrency}
                      highlightedRate={highlightedRate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Disclaimer />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TaxCalculatorApp;
