import React from 'react';

const ResultsTable = ({
  selectedYear,
  selectedCurrency,
  customRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  calculateIncome,
  formatCurrency,
}) => {
  // Ensure rates are valid numbers, use defaults if not
  const currentUsdToRonRate = isNaN(usdToRonRate) || usdToRonRate <= 0 ? 4.6 : usdToRonRate;
  const currentEurToRonRate = isNaN(ronToEurRate) || ronToEurRate <= 0 ? 5.07 : ronToEurRate;
  const currentMicroSrlTaxRate =
    isNaN(microSrlTaxRate) || microSrlTaxRate < 1 || microSrlTaxRate > 3 ? 1 : microSrlTaxRate;
  const currentNextYearDividendTaxRate =
    isNaN(nextYearDividendTaxRate) || nextYearDividendTaxRate < 0 ? 16 : nextYearDividendTaxRate;

  const fixedRates = [20, 25, 30, 35];

  const renderRow = (data, isCustom = false) => {
    let companyNetValue = 0;
    let individualNetValue = 0;
    let companyTaxValue = 0;
    let individualTaxValue = 0;
    let currencySymbol = '';

    // Determine currency symbol
    switch (selectedCurrency) {
      case 'USD':
        currencySymbol = '$';
        break;
      case 'RON':
        currencySymbol = 'RON ';
        break;
      case 'EUR':
        currencySymbol = '€';
        break;
      default:
        currencySymbol = '$';
        break;
    }

    // Assign values based on selected year and currency
    if (selectedYear === '2025') {
      switch (selectedCurrency) {
        case 'USD':
          companyNetValue = data.companyNet2025USD;
          companyTaxValue = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2025USD;
          individualTaxValue =
            data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          break;
        case 'RON':
          companyNetValue = data.companyNet2025RON;
          companyTaxValue = data.companyTax2025RON;
          individualNetValue = data.individualNet2025RON;
          individualTaxValue = data.individualTaxes2025RON;
          break;
        case 'EUR':
          companyNetValue = data.companyNet2025Eur;
          companyTaxValue = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          individualNetValue = data.individualNet2025Eur;
          individualTaxValue =
            data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          break;
        default:
          companyNetValue = data.companyNet2025USD;
          companyTaxValue = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2025USD;
          individualTaxValue =
            data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          break;
      }
    } else {
      // 2026
      switch (selectedCurrency) {
        case 'USD':
          companyNetValue = data.companyNet2026USD;
          companyTaxValue = data.companyTax2026RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2026DividendUSD;
          individualTaxValue =
            data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          break;
        case 'RON':
          companyNetValue = data.companyNet2026RON;
          companyTaxValue = data.companyTax2026RON;
          individualNetValue = data.individualNet2026DividendRON;
          individualTaxValue = data.individualTaxes2026DividendRON;
          break;
        case 'EUR':
          companyNetValue = data.companyNet2026Eur;
          companyTaxValue = data.companyTax2026RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          individualNetValue = data.individualNet2026DividendEur;
          individualTaxValue =
            data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyEur);
          break;
        default:
          companyNetValue = data.companyNet2026USD;
          companyTaxValue = data.companyTax2026RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2026DividendUSD;
          individualTaxValue =
            data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          break;
      }
    }

    return (
      <tr
        key={isCustom ? 'custom' : data.hourlyRate}
        className={`${isCustom ? 'bg-purple-50 font-semibold' : ''} border-b border-gray-200 last:border-b-0`}
      >
        <td data-label="Rate" className="py-3 px-4">
          {formatCurrency(data.hourlyRate)}/hr
        </td>
        <td data-label="Gross (USD)" className="py-3 px-4">
          {formatCurrency(data.grossMonthlyUSD, '$')}
        </td>
        <td data-label={`Company Net (${selectedYear})`} className="py-3 px-4">
          {formatCurrency(companyNetValue, currencySymbol)}
        </td>
        <td data-label={`Company Tax (${selectedYear})`} className="py-3 px-4">
          {formatCurrency(companyTaxValue, currencySymbol)}
        </td>
        <td data-label={`Individual Net (${selectedYear})`} className="py-3 px-4">
          {formatCurrency(individualNetValue, currencySymbol)}
        </td>
        <td data-label={`Individual Tax (${selectedYear})`} className="py-3 px-4">
          {formatCurrency(individualTaxValue, currencySymbol)}
        </td>
      </tr>
    );
  };

  return (
    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm w-full border-collapse border-spacing-0 mt-6 text-left">
      <thead>
        <tr>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Hourly Rate
          </th>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Gross Monthly Income (USD)
          </th>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Company Net ({selectedYear} - {selectedCurrency})
          </th>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Company Tax ({selectedYear} - {selectedCurrency})
          </th>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Individual Net ({selectedYear} - {selectedCurrency})
          </th>
          <th className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-sm border-b border-gray-200">
            Individual Taxes ({selectedYear} - {selectedCurrency})
          </th>
        </tr>
      </thead>
      <tbody>
        {fixedRates.map((rate) => {
          const data = calculateIncome(
            rate,
            currentUsdToRonRate,
            currentEurToRonRate,
            currentMicroSrlTaxRate,
            currentNextYearDividendTaxRate
          );
          return renderRow(data);
        })}
        {!isNaN(customRate) &&
          customRate > 0 &&
          renderRow(
            calculateIncome(
              customRate,
              currentUsdToRonRate,
              currentEurToRonRate,
              currentMicroSrlTaxRate,
              currentNextYearDividendTaxRate
            ),
            true
          )}
      </tbody>
    </table>
  );
};

export default ResultsTable;
