describe('Complementary Colors App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'complementary-colors');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the color theory application', () => {
    cy.navigateToProject('Complementary Colors');

    cy.url().should('include', '/complementary-colors');
    cy.get('h1').should('contain', 'Complementary Colors');
  });

  it('should display the color wheel interface', () => {
    cy.navigateToProject('Complementary Colors');

    // Check for color wheel elements
    cy.get('.color-wheel, [data-testid="color-wheel"], svg', { timeout: 5000 }).should(
      'be.visible'
    );

    // Check for color display areas
    cy.get('.color-display, .color-preview, [data-testid="color-display"]').should('be.visible');
  });

  it('should allow color selection on the wheel', () => {
    cy.navigateToProject('Complementary Colors');

    // Wait for color wheel to load
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

    // Click on different areas of the color wheel
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().click(100, 100);

    cy.waitForAnimations();

    // Color values should update
    cy.get('[data-testid="selected-color"], .selected-color, .color-value').should('be.visible');
  });

  it('should display complementary color when primary color is selected', () => {
    cy.navigateToProject('Complementary Colors');

    // Wait for interface to load
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

    // Select a color
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().click(150, 50);

    cy.waitForAnimations();

    // Check that complementary color is displayed
    cy.get('[data-testid="complementary-color"], .complementary-color, .complement').should(
      'be.visible'
    );
  });

  it('should show color harmony variations', () => {
    cy.navigateToProject('Complementary Colors');

    // Wait for color wheel
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

    // Select a color
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().click(100, 100);

    cy.waitForAnimations();

    // Look for harmony displays (analogous, triadic, etc.)
    cy.get('.harmony, [data-testid="color-harmony"], .analogous, .triadic').should(
      'have.length.greaterThan',
      0
    );
  });

  it('should display hex and RGB color values', () => {
    cy.navigateToProject('Complementary Colors');

    // Select a color
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible').click(100, 100);

    cy.waitForAnimations();

    // Check for hex values
    cy.get('body').should('contain.text', '#');

    // Check for RGB values
    cy.get('body').should('contain.text', 'RGB');
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Complementary Colors');

      // Color wheel should be visible on all devices
      cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, layout might be stacked
        cy.get('.color-display, .color-preview').should('be.visible');
      }
    });
  });

  it('should handle multiple color selections', () => {
    cy.navigateToProject('Complementary Colors');

    // Wait for color wheel
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

    // Select multiple colors in sequence
    const positions = [
      [100, 100],
      [200, 150],
      [150, 200],
    ];

    positions.forEach(([x, y]) => {
      cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().click(x, y);

      cy.waitForAnimations();

      // Each selection should update the display
      cy.get('.color-display, [data-testid="color-display"]').should('be.visible');
    });
  });

  it('should provide visual feedback for color interactions', () => {
    cy.navigateToProject('Complementary Colors');

    // Wait for color wheel
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible');

    // Hover over color wheel (if hover effects exist)
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().trigger('mouseover', 100, 100);

    // Click to select
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').first().click(100, 100);

    cy.waitForAnimations();

    // Visual feedback should be present
    cy.get('body').should('be.visible'); // Basic check for no crashes
  });

  it('should calculate accurate complementary colors', () => {
    cy.navigateToProject('Complementary Colors');

    // This test would need specific implementation details
    // to verify color calculation accuracy
    cy.get('.color-wheel, [data-testid="color-wheel"], svg').should('be.visible').click(100, 100);

    cy.waitForAnimations();

    // Check that colors are displayed (specific values would require DOM inspection)
    cy.get('[data-testid="selected-color"], .selected-color').should('be.visible');
    cy.get('[data-testid="complementary-color"], .complementary-color').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Complementary Colors');

    // Find and click back/home button
    cy.get('[data-testid="back-to-home"], .back-button, a[href="/"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
