const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    video: true,
    videoCompression: 32, // Compress videos (0-51, lower = better quality, higher = smaller file)
    videoUploadOnPasses: false, // Only keep videos for failed tests
    screenshot: true,
    screenshotOnRunFailure: true, // Take screenshots when tests fail
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },

  env: {
    // Environment variables for testing
    REACT_APP_TEST_MODE: true,
    // Firebase test configuration (you should use test/dev credentials here)
    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || 'test-api-key',
    REACT_APP_FIREBASE_AUTH_DOMAIN:
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'test.firebaseapp.com',
    REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'test-project',
    REACT_APP_FIREBASE_STORAGE_BUCKET:
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'test.appspot.com',
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456',
    REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || 'test-app-id',
  },

  // Performance and reliability settings
  retries: {
    runMode: 2,
    openMode: 0,
  },

  // Browser settings
  chromeWebSecurity: false,

  // Ignore specific errors that might occur during testing
  experimentalStudio: true,
});
