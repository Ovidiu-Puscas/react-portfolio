const API_KEY = process.env.REACT_APP_CURRENCY_API_KEY;
const API_URL = 'https://api.currencyapi.com/v3/latest';

// Default fallback rates in case API fails
const DEFAULT_RATES = {
  USD_TO_RON: 4.37,
  EUR_TO_RON: 5.07
};

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.USD || !data.data.EUR || !data.data.RON) {
      throw new Error('Invalid API response structure');
    }

    // Extract rates from API response
    const usdToRon = data.data.RON.value; // RON value relative to USD
    const eurToUsd = data.data.EUR.value; // EUR value relative to USD
    const eurToRon = usdToRon / eurToUsd; // Calculate EUR to RON

    return {
      usdToRon: usdToRon.toFixed(4),
      eurToRon: eurToRon.toFixed(4),
      lastUpdated: data.meta.last_updated_at,
      success: true
    };
  } catch (error) {
    console.warn('Failed to fetch exchange rates from API:', error.message);
    return {
      usdToRon: DEFAULT_RATES.USD_TO_RON.toString(),
      eurToRon: DEFAULT_RATES.EUR_TO_RON.toString(),
      lastUpdated: null,
      success: false,
      error: error.message
    };
  }
};

export const getDefaultRates = () => {
  return {
    usdToRon: DEFAULT_RATES.USD_TO_RON.toString(),
    eurToRon: DEFAULT_RATES.EUR_TO_RON.toString()
  };
};
