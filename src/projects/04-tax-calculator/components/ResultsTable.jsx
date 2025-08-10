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
  highlightedRate,
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
    let grossMonthlyValue = 0;
    let grossAnnualValue = 0;
    let netAnnualValue = 0;
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

    // Calculate gross values in selected currency
    switch (selectedCurrency) {
      case 'USD':
        grossMonthlyValue = data.grossMonthlyUSD;
        grossAnnualValue = data.grossMonthlyUSD * 12;
        break;
      case 'RON':
        grossMonthlyValue = data.grossMonthlyRON;
        grossAnnualValue = data.grossMonthlyRON * 12;
        break;
      case 'EUR':
        grossMonthlyValue = data.grossMonthlyEur;
        grossAnnualValue = data.grossMonthlyEur * 12;
        break;
      default:
        grossMonthlyValue = data.grossMonthlyUSD;
        grossAnnualValue = data.grossMonthlyUSD * 12;
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
          netAnnualValue = data.individualNet2025USD * 12;
          break;
        case 'RON':
          companyNetValue = data.companyNet2025RON;
          companyTaxValue = data.companyTax2025RON;
          individualNetValue = data.individualNet2025RON;
          individualTaxValue = data.individualTaxes2025RON;
          netAnnualValue = data.individualNet2025RON * 12;
          break;
        case 'EUR':
          companyNetValue = data.companyNet2025Eur;
          companyTaxValue = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          individualNetValue = data.individualNet2025Eur;
          individualTaxValue =
            data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          netAnnualValue = data.individualNet2025Eur * 12;
          break;
        default:
          companyNetValue = data.companyNet2025USD;
          companyTaxValue = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2025USD;
          individualTaxValue =
            data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          netAnnualValue = data.individualNet2025USD * 12;
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
          netAnnualValue = data.individualNet2026DividendUSD * 12;
          break;
        case 'RON':
          companyNetValue = data.companyNet2026RON;
          companyTaxValue = data.companyTax2026RON;
          individualNetValue = data.individualNet2026DividendRON;
          individualTaxValue = data.individualTaxes2026DividendRON;
          netAnnualValue = data.individualNet2026DividendRON * 12;
          break;
        case 'EUR':
          companyNetValue = data.companyNet2026Eur;
          companyTaxValue = data.companyTax2026RON / (data.grossMonthlyRON / data.grossMonthlyEur);
          individualNetValue = data.individualNet2026DividendEur;
          individualTaxValue =
            data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyEur);
          netAnnualValue = data.individualNet2026DividendEur * 12;
          break;
        default:
          companyNetValue = data.companyNet2026USD;
          companyTaxValue = data.companyTax2026RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          individualNetValue = data.individualNet2026DividendUSD;
          individualTaxValue =
            data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyUSD);
          netAnnualValue = data.individualNet2026DividendUSD * 12;
          break;
      }
    }

    const isHighlighted = highlightedRate && Math.abs(data.hourlyRate - highlightedRate) < 0.01;

    return (
      <tr
        key={isCustom ? 'custom' : data.hourlyRate}
        className={`${isCustom ? 'bg-purple-50 font-semibold' : ''} ${
          isHighlighted ? 'bg-yellow-50 ring-2 ring-yellow-400' : ''
        } border-b border-gray-200 last:border-b-0 transition-all duration-300 w-full`}
      >
        <td
          data-label="Rate"
          className="py-2 px-3 w-full lg:py-3 lg:px-4 font-medium whitespace-nowrap"
        >
          {formatCurrency(data.hourlyRate)}/hr
        </td>
        <td
          data-label={`Gross Monthly`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap"
        >
          {formatCurrency(grossMonthlyValue, currencySymbol)}
        </td>
        <td
          data-label={`Gross Annual`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap hidden sm:table-cell"
        >
          {formatCurrency(grossAnnualValue, currencySymbol)}
        </td>
        <td
          data-label={`Company Net`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap hidden md:table-cell"
        >
          {formatCurrency(companyNetValue, currencySymbol)}
        </td>
        <td
          data-label={`Company Tax`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap hidden lg:table-cell"
        >
          {formatCurrency(companyTaxValue, currencySymbol)}
        </td>
        <td
          data-label={`Net Income`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 font-semibold text-green-600 whitespace-nowrap"
        >
          {formatCurrency(individualNetValue, currencySymbol)}
        </td>
        <td
          data-label={`Net Annual`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap hidden sm:table-cell"
        >
          {formatCurrency(netAnnualValue, currencySymbol)}
        </td>
        <td
          data-label={`Individual Tax`}
          className="py-2 px-3 w-full lg:py-3 lg:px-4 whitespace-nowrap hidden lg:table-cell"
        >
          {formatCurrency(individualTaxValue, currencySymbol)}
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto -mx-3 px-3 lg:mx-0 lg:px-0">
      <table
        data-testid="tax-breakdown"
        className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm w-full border-collapse border-spacing-0 text-left text-sm lg:text-base"
      >
        <thead>
          <tr>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap">
              Rate
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap">
              <span className="hidden sm:inline">Gross</span> Monthly
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap hidden sm:table-cell">
              <span className="hidden lg:inline">Gross</span> Annual
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap hidden md:table-cell">
              Co. Net
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap hidden lg:table-cell">
              Co. Tax
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap">
              Net Income
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap hidden sm:table-cell">
              Net Annual
            </th>
            <th className="py-2 px-3 w-full lg:py-3 lg:px-4 bg-gray-50 font-semibold text-gray-700 uppercase text-xs lg:text-sm border-b border-gray-200 whitespace-nowrap hidden lg:table-cell">
              Ind. Tax
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
    </div>
  );
};

export default ResultsTable;
