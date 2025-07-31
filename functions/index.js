const functions = require('firebase-functions');
const https = require('https');

exports.getCurrencyRates = functions.https.onCall(async (data, context) => {
  // Only allow authenticated requests if needed
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  // }

  const apiKey = functions.config().currency.api_key;
  const { base, currencies } = data;
  
  try {
    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${base}&currencies=${currencies}`);
    const result = await response.json();
    return result;
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to fetch currency rates');
  }
});