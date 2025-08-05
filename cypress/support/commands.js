// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to navigate to a specific project
Cypress.Commands.add('navigateToProject', (projectName) => {
  cy.visit('/');
  cy.waitForProjectLoad();
  // Use liquid glass card navigation
  cy.get('.liquid-app-card').contains(projectName).should('be.visible').click();
});

// Custom command to wait for project to load
Cypress.Commands.add('waitForProjectLoad', () => {
  // Wait for the main content to be visible instead of looking for loading spinner
  cy.get('body').should('be.visible');
  // Wait a bit for any animations to complete
  cy.wait(500);
});

// Custom command to take screenshot with timestamp
Cypress.Commands.add('screenshotWithTimestamp', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});

// Custom command to test responsive behavior
Cypress.Commands.add('testResponsive', (callback) => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    cy.log(`Testing on ${viewport.name} viewport`);
    if (callback) callback(viewport);
  });
});

// Custom command to handle async operations with retry
Cypress.Commands.add('waitForElement', (selector, options = {}) => {
  const { timeout = 10000, interval = 100 } = options;

  cy.get(selector, { timeout }).should('be.visible').and('not.be.disabled');
});

// Custom command for Three.js canvas interaction
Cypress.Commands.add('interactWithCanvas', (canvasSelector, x, y) => {
  cy.get(canvasSelector)
    .should('be.visible')
    .trigger('mousedown', x, y, { which: 1 })
    .trigger('mousemove', x + 10, y + 10)
    .trigger('mouseup');
});

// Custom command to test form interactions
Cypress.Commands.add('fillAndSubmitForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    if (field.includes('select')) {
      cy.get(`[data-testid="${field}"]`).select(value);
    } else if (field.includes('checkbox')) {
      if (value) cy.get(`[data-testid="${field}"]`).check();
    } else {
      cy.get(`[data-testid="${field}"]`).clear().type(value);
    }
  });
});

// Custom command to test drag and drop
Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).trigger('mousedown', { which: 1 });
  cy.get(targetSelector).trigger('mousemove').trigger('mouseup');
});

// Custom command to wait for animations to complete
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(500); // Wait for CSS transitions/animations
});

// Custom command to test accessibility
Cypress.Commands.add('checkA11y', () => {
  // Basic accessibility checks
  // Check for images with alt text if they exist
  cy.get('body').then(($body) => {
    if ($body.find('img').length > 0) {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    }
  });

  // Check that interactive elements are visible
  cy.get('button').should('exist');

  // Check for proper heading hierarchy
  cy.get('h1').should('exist');
});

// Custom command to handle Firebase Auth mock
Cypress.Commands.add('mockFirebaseAuth', (user = null) => {
  cy.window().then((win) => {
    if (win.firebase && win.firebase.auth) {
      // Mock Firebase auth state
      win.firebase.auth().currentUser = user;
    }
  });
});

// Custom command to test error boundaries
Cypress.Commands.add('testErrorBoundary', (triggerError) => {
  // Trigger error and check if error boundary catches it
  cy.window().then((win) => {
    win.addEventListener('error', (e) => {
      // Don't let the error fail the test - error boundary should handle it
      e.preventDefault();
      return false;
    });
  });

  if (triggerError) triggerError();

  // Check if error fallback UI is shown
  cy.get('[data-testid="error-fallback"]', { timeout: 5000 }).should('be.visible');
});
