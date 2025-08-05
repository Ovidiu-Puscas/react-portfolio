import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import InputForm from './components/InputForm';
import SelectionOptions from './components/SelectionOptions';
import ResultsTable from './components/ResultsTable';
import Disclaimer from './components/Disclaimer';
import { fetchExchangeRates, getDefaultRates } from './services/currencyService';
import ErrorFallback from '../../components/ErrorFallback';
import { logError } from '../../utils/errorLogger';
import './TaxCalculator.css';

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
        {/* Exchange Rate Status */}
        <div className="py-4 mb-6">
          {isLoadingRates && (
            <div className="text-blue-600 text-sm mb-2" data-testid="loading">
              🔄 Loading real-time exchange rates...
            </div>
          )}
          {lastUpdated && (
            <div className="text-green-600 text-sm mb-2">
              ✅ Rates updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
          {apiError && (
            <div className="text-orange-600 text-sm mb-2">⚠️ Using default rates: {apiError}</div>
          )}
          <button
            onClick={refreshRates}
            disabled={isLoadingRates}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingRates ? 'Refreshing...' : '🔄 Refresh Rates'}
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

        <SelectionOptions
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />

        <div data-testid="tax-results" className="overflow-visible">
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
          />
        </div>

        <Disclaimer />
      </div>
    </ErrorBoundary>
  );
};

export default TaxCalculatorApp;
