export const transformDataForIncomeComparison = (
  rates,
  customRate,
  calculateIncome,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedCurrency,
  selectedYear
) => {
  const allRates = [...rates];
  if (customRate && !isNaN(customRate) && customRate > 0) {
    allRates.push(customRate);
  }

  return allRates.map((rate) => {
    const data = calculateIncome(
      rate,
      usdToRonRate,
      ronToEurRate,
      microSrlTaxRate,
      nextYearDividendTaxRate
    );

    let grossValue, netValue;
    const isYear2025 = selectedYear === '2025';

    switch (selectedCurrency) {
      case 'USD':
        grossValue = data.grossMonthlyUSD;
        netValue = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
        break;
      case 'RON':
        grossValue = data.grossMonthlyRON;
        netValue = isYear2025 ? data.individualNet2025RON : data.individualNet2026DividendRON;
        break;
      case 'EUR':
        grossValue = data.grossMonthlyEur;
        netValue = isYear2025 ? data.individualNet2025Eur : data.individualNet2026DividendEur;
        break;
      default:
        grossValue = data.grossMonthlyUSD;
        netValue = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
    }

    return {
      rate: `$${rate}/hr`,
      gross: Math.round(grossValue),
      net: Math.round(netValue),
      difference: Math.round(grossValue - netValue),
    };
  });
};

export const transformDataForTaxBreakdown = (
  hourlyRate,
  calculateIncome,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedCurrency,
  selectedYear
) => {
  const data = calculateIncome(
    hourlyRate,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate
  );

  const isYear2025 = selectedYear === '2025';
  let companyTax, individualTax, netIncome;

  switch (selectedCurrency) {
    case 'USD':
      companyTax = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
      individualTax = isYear2025
        ? data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD)
        : data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyUSD);
      netIncome = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
      break;
    case 'RON':
      companyTax = isYear2025 ? data.companyTax2025RON : data.companyTax2026RON;
      individualTax = isYear2025
        ? data.individualTaxes2025RON
        : data.individualTaxes2026DividendRON;
      netIncome = isYear2025 ? data.individualNet2025RON : data.individualNet2026DividendRON;
      break;
    case 'EUR':
      companyTax = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyEur);
      individualTax = isYear2025
        ? data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyEur)
        : data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyEur);
      netIncome = isYear2025 ? data.individualNet2025Eur : data.individualNet2026DividendEur;
      break;
    default:
      companyTax = data.companyTax2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD);
      individualTax = isYear2025
        ? data.individualTaxes2025RON / (data.grossMonthlyRON / data.grossMonthlyUSD)
        : data.individualTaxes2026DividendRON / (data.grossMonthlyRON / data.grossMonthlyUSD);
      netIncome = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
  }

  return [
    { name: 'Company Tax', value: Math.round(companyTax), fill: '#8b5cf6' },
    { name: 'Individual Tax', value: Math.round(individualTax), fill: '#3b82f6' },
    { name: 'Net Income', value: Math.round(netIncome), fill: '#10b981' },
  ];
};

export const transformDataForRateProgression = (
  calculateIncome,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedCurrency,
  selectedYear
) => {
  const rates = [];
  for (let rate = 20; rate <= 35; rate += 1) {
    rates.push(rate);
  }

  return rates.map((rate) => {
    const data = calculateIncome(
      rate,
      usdToRonRate,
      ronToEurRate,
      microSrlTaxRate,
      nextYearDividendTaxRate
    );

    const isYear2025 = selectedYear === '2025';
    let grossValue, netValue, companyNetValue;

    switch (selectedCurrency) {
      case 'USD':
        grossValue = data.grossMonthlyUSD;
        netValue = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
        companyNetValue = isYear2025 ? data.companyNet2025USD : data.companyNet2026USD;
        break;
      case 'RON':
        grossValue = data.grossMonthlyRON;
        netValue = isYear2025 ? data.individualNet2025RON : data.individualNet2026DividendRON;
        companyNetValue = isYear2025 ? data.companyNet2025RON : data.companyNet2026RON;
        break;
      case 'EUR':
        grossValue = data.grossMonthlyEur;
        netValue = isYear2025 ? data.individualNet2025Eur : data.individualNet2026DividendEur;
        companyNetValue = isYear2025 ? data.companyNet2025Eur : data.companyNet2026Eur;
        break;
      default:
        grossValue = data.grossMonthlyUSD;
        netValue = isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD;
        companyNetValue = isYear2025 ? data.companyNet2025USD : data.companyNet2026USD;
    }

    return {
      rate,
      gross: Math.round(grossValue),
      companyNet: Math.round(companyNetValue),
      individualNet: Math.round(netValue),
    };
  });
};

export const transformDataForCurrencyComparison = (
  hourlyRate,
  calculateIncome,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedYear
) => {
  const data = calculateIncome(
    hourlyRate,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate
  );

  const isYear2025 = selectedYear === '2025';

  return [
    {
      currency: 'USD',
      gross: Math.round(data.grossMonthlyUSD),
      net: Math.round(isYear2025 ? data.individualNet2025USD : data.individualNet2026DividendUSD),
    },
    {
      currency: 'RON',
      gross: Math.round(data.grossMonthlyRON),
      net: Math.round(isYear2025 ? data.individualNet2025RON : data.individualNet2026DividendRON),
    },
    {
      currency: 'EUR',
      gross: Math.round(data.grossMonthlyEur),
      net: Math.round(isYear2025 ? data.individualNet2025Eur : data.individualNet2026DividendEur),
    },
  ];
};

export const transformDataForYearComparison = (
  rates,
  customRate,
  calculateIncome,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedCurrency
) => {
  const allRates = [...rates];
  if (customRate && !isNaN(customRate) && customRate > 0) {
    allRates.push(customRate);
  }

  return allRates.map((rate) => {
    const data = calculateIncome(
      rate,
      usdToRonRate,
      ronToEurRate,
      microSrlTaxRate,
      nextYearDividendTaxRate
    );

    let net2025, net2026;

    switch (selectedCurrency) {
      case 'USD':
        net2025 = data.individualNet2025USD;
        net2026 = data.individualNet2026DividendUSD;
        break;
      case 'RON':
        net2025 = data.individualNet2025RON;
        net2026 = data.individualNet2026DividendRON;
        break;
      case 'EUR':
        net2025 = data.individualNet2025Eur;
        net2026 = data.individualNet2026DividendEur;
        break;
      default:
        net2025 = data.individualNet2025USD;
        net2026 = data.individualNet2026DividendUSD;
    }

    return {
      rate: `$${rate}/hr`,
      2025: Math.round(net2025),
      2026: Math.round(net2026),
      difference: Math.round(net2026 - net2025),
    };
  });
};

export const getCurrencySymbol = (currency) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'RON':
      return 'RON';
    case 'EUR':
      return '€';
    default:
      return '$';
  }
};

export const formatTooltipValue = (value, currency) => {
  const symbol = getCurrencySymbol(currency);
  if (currency === 'RON') {
    return `${symbol} ${value.toLocaleString()}`;
  }
  return `${symbol}${value.toLocaleString()}`;
};
