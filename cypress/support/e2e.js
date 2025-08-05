// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Disable service worker during testing
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific errors that might occur during testing
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  if (err.message.includes('ChunkLoadError')) {
    return false;
  }
  // Let other errors fail the test
  return true;
});

// Custom viewport presets
Cypress.Commands.add('setViewport', (preset) => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720],
    wide: [1920, 1080],
  };

  if (viewports[preset]) {
    cy.viewport(viewports[preset][0], viewports[preset][1]);
  }
});
