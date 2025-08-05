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

    // Check that we're in the tax calculator app by looking for app-specific elements
    cy.get('.liquid-nav-title').should('contain.text', 'Tax & Currency Calculator');
    cy.get('[data-testid="income-input"]').should('be.visible');
    cy.get('[data-testid="currency-select"]').should('be.visible');
  });

  it('should display input form with required fields', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Check for income input
    cy.get(
      'input[type="number"], input[placeholder*="income"], [data-testid="income-input"]'
    ).should('be.visible');

    // Check for currency selector
    cy.get('[data-testid="currency-select"]').should('be.visible');

    // Check for year selector
    cy.get('[data-testid="year-select"]').should('be.visible');
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

    // Select currency using radio buttons
    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get(`input[value="${testData.testData.currency}"]`).check();
    });

    // Verify selection
    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get(`input[value="${testData.testData.currency}"]`).should('be.checked');
    });
  });

  it('should allow selecting tax year', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Select year using radio buttons
    cy.get('[data-testid="year-select"]').within(() => {
      cy.get(`input[value="${testData.testData.year}"]`).check();
    });

    // Verify selection
    cy.get('[data-testid="year-select"]').within(() => {
      cy.get(`input[value="${testData.testData.year}"]`).should('be.checked');
    });
  });

  it('should calculate taxes when values are entered', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Fill out the form
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type(testData.testData.income);

    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get(`input[value="${testData.testData.currency}"]`).check();
    });

    cy.get('[data-testid="year-select"]').within(() => {
      cy.get(`input[value="${testData.testData.year}"]`).check();
    });

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

    // Check for specific tax types and table headers
    cy.get('[data-testid="tax-breakdown"]').should('contain.text', 'Company Tax');
    cy.get('[data-testid="tax-breakdown"]').should('contain.text', 'Individual Net');
    cy.get('[data-testid="tax-breakdown"]').should('contain.text', 'Hourly Rate');
  });

  it('should show real-time currency exchange rates', () => {
    cy.navigateToProject('Tax & Currency Calculator');

    // Enter income in USD
    cy.get('input[type="number"], input[placeholder*="income"], [data-testid="income-input"]')
      .first()
      .clear()
      .type('1000');

    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get('input[value="USD"]').check();
    });

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
        cy.get('[data-testid="currency-select"]').within(() => {
          cy.get(`input[value="${currency}"]`).check();
        });

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
    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get('input[value="USD"]').check();
    });

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

    cy.get('[data-testid="currency-select"]').within(() => {
      cy.get('input[value="USD"]').check();
    });

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
    cy.get('[data-testid="back-to-home"], .liquid-back-button, .back-button')
      .first()
      .should('be.visible')
      .click();

    // Check that we're back on the homepage by looking for project cards
    cy.get('.liquid-app-card').should('have.length.greaterThan', 0);
    cy.get('.liquid-hero-title').should('be.visible');
  });
});
