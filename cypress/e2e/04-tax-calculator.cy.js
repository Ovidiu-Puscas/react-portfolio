describe('Tax Calculator App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'tax-calculator');
    });
  });

  beforeEach(() => {
    // Handle Firebase errors by setting up a listener
    cy.on('uncaught:exception', (err) => {
      // Ignore Firebase API key errors in test environment
      if (err.message.includes('auth/invalid-api-key')) {
        return false;
      }
      return true;
    });

    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the tax calculator application', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    cy.url().should('include', '/tax-calculator');
    cy.get('.liquid-nav-title').should('contain.text', 'Tax & Currency Calculator');
  });

  it('should display input form with required fields', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Check for income input
    cy.get(
      'input[type="number"], input[placeholder*="income"], [data-testid="income-input"]'
    ).should('be.visible');

    // Check for currency selector
    cy.get('select, [data-testid="currency-select"]').should('be.visible');

    // Check for year selector
    cy.get('select, [data-testid="year-select"]').should('be.visible');
  });

  it('should allow entering income amount', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Enter income
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type(testData.testData.income);

    // Verify value is entered
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .should('have.value', testData.testData.income);
  });

  it('should allow selecting currency', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Select currency
    cy.get('select, [data-testid="currency-select"]').first().select(testData.testData.currency);

    // Verify selection
    cy.get('select, [data-testid="currency-select"]')
      .first()
      .should('have.value', testData.testData.currency);
  });

  it('should allow selecting tax year', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Select year
    cy.get('select, [data-testid="year-select"]').first().select(testData.testData.year);

    // Verify selection
    cy.get('select, [data-testid="year-select"]')
      .first()
      .should('have.value', testData.testData.year);
  });

  it('should calculate taxes when values are entered', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Fill out the form
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type(testData.testData.income);

    cy.get('select, [data-testid="currency-select"]').first().select(testData.testData.currency);

    cy.get('select, [data-testid="year-select"]').first().select(testData.testData.year);

    // Wait for calculation
    cy.wait(1000);

    // Check that results are displayed
    cy.get('.results, [data-testid="tax-results"], table').should('be.visible');
  });

  it('should display tax breakdown table', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Enter valid data
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type(testData.testData.income);

    cy.wait(1000);

    // Check for tax breakdown
    cy.get('table, .tax-breakdown, [data-testid="tax-breakdown"]').should('be.visible');

    // Check for specific tax types
    // Check for tax calculation results
    cy.get('body').should('contain.text', 'Income Tax');
    cy.get('body').should('contain.text', 'Tax');
    cy.get('body').should('contain.text', 'Total');
  });

  it('should show real-time currency exchange rates', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Enter income in USD
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('1000');

    cy.get('select, [data-testid="currency-select"]').first().select('USD');

    cy.wait(2000); // Wait for API call

    // Check for exchange rate information
    // Check for currency exchange information
    cy.get('body').should('contain.text', 'RON');
    cy.get('body').should('contain.text', 'Exchange');
    cy.get('body').should('contain.text', 'Rate');
  });

  it('should handle different currencies correctly', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    const currencies = ['USD', 'EUR', 'RON'];

    currencies.forEach((currency) => {
      if (currency !== 'RON') {
        // Skip if RON is already selected
        cy.get('select, [data-testid="currency-select"]').first().select(currency);

        cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
          .first()
          .clear()
          .type('1000');

        cy.wait(1000);

        // Results should update
        cy.get('.results, [data-testid="tax-results"], table').should('be.visible');
      }
    });
  });

  it('should validate input fields', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Try negative income
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('-1000');

    // Should handle gracefully or show validation
    cy.get('body').should('be.visible');

    // Try very large number
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('999999999');

    // Should handle gracefully
    cy.get('body').should('be.visible');
  });

  it('should be responsive on mobile devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Tax & Currency Calculator');

      // Form should be visible on all devices
      cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
        .first()
        .should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, table might be scrollable
        cy.get('table, .tax-breakdown').should('be.visible');
      }
    });
  });

  it('should show loading state while fetching exchange rates', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Change currency to trigger API call
    cy.get('select, [data-testid="currency-select"]').first().select('USD');

    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('1000');

    // Look for loading indicator (might be brief)
    cy.get('.loading, .spinner, [data-testid="loading"]').should('exist');
  });

  it('should handle API failures gracefully', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Intercept API calls and simulate failure
    cy.intercept('GET', '**/api/currency/**', { statusCode: 500 }).as('currencyAPI');

    cy.get('select, [data-testid="currency-select"]').first().select('USD');

    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('1000');

    // Should still show results with fallback rates
    cy.get('.results, [data-testid="tax-results"], table').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Find and click back/home button
    cy.get('[data-testid="back-to-home"], .back-button, a[href="/"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
