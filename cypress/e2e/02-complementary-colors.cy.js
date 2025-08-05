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

  it('should load the project from homepage', () => {
    cy.get('[role="button"]').contains('Color Harmony Generator').should('be.visible').click();

    cy.get('h1').should('contain', 'Color Harmony Generator');
    cy.get('button').contains('Back to Library').should('be.visible');
  });

  it('should display the main interface elements', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Check main sections
    cy.get('h2').contains('Color Picker').should('be.visible');
    cy.get('h3').contains('Color Harmony').should('be.visible');
    cy.get('h3').contains('Custom Color').should('be.visible');
    cy.get('h3').contains('Quick Colors').should('be.visible');

    // Check color wheel
    cy.get('svg').should('be.visible'); // Color wheel is SVG

    // Check custom hex input
    cy.get('input[placeholder="#FF0000"]').should('be.visible');
  });

  it('should display default complementary colors', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Should show harmony display section
    cy.get('.grid.grid-cols-1.lg\\:grid-cols-2').should('be.visible');

    // Default should be complementary harmony
    cy.get('button[aria-checked="true"]').should('contain.text', 'Complementary');
  });

  it('should update colors when hex input is changed', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Change the hex color input
    cy.get('input[placeholder="#FF0000"]').clear().type('#00FF00');

    // The color preview should update
    cy.get('.w-12.h-12.rounded-lg')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgb(255, 0, 0)'); // Should not be the default red
  });

  it('should show different harmony types', () => {
    cy.navigateToProject('Color Harmony Generator');

    const harmonyTypes = [
      'Complementary',
      'Monochromatic',
      'Analogous',
      'Triadic',
      'Tetradic',
      'Square',
    ];

    harmonyTypes.forEach((harmonyType) => {
      // Find and click harmony type button
      cy.get('button[role="radio"]').contains(harmonyType).click();

      // Should show as selected
      cy.get('button[aria-checked="true"]').should('contain.text', harmonyType);
    });
  });

  it('should allow selecting preset colors', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Click on a preset color (first one should be red #FF0000)
    cy.get('.grid.grid-cols-6 button').first().click();

    // Should update the hex input
    cy.get('input[placeholder="#FF0000"]').should('have.value', '#FF0000');
  });

  it('should have proper accessibility features', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Check radiogroup for harmony options
    cy.get('[role="radiogroup"]')
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Color harmony options');

    // Check that harmony buttons have proper radio role
    cy.get('button[role="radio"]').should('have.length', 6);

    // Check that preset color buttons have titles
    cy.get('.grid.grid-cols-6 button').each(($button) => {
      cy.wrap($button).should('have.attr', 'title');
    });
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Color Harmony Generator');

      // Color picker should be visible on all devices
      cy.get('h2').contains('Color Picker').should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, grid should stack
        cy.get('.grid.grid-cols-1.lg\\:grid-cols-2').should('be.visible');
      }

      if (viewport.name === 'desktop') {
        // On desktop, should use 2 columns
        cy.get('.lg\\:grid-cols-2').should('exist');
      }
    });
  });

  it('should validate hex input format', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Enter invalid hex color
    cy.get('input[placeholder="#FF0000"]').clear().type('invalid');

    // Input should still be visible but color won't update
    cy.get('input[placeholder="#FF0000"]').should('have.value', 'invalid');

    // Enter valid hex color
    cy.get('input[placeholder="#FF0000"]').clear().type('#123ABC');

    // Color preview should update
    cy.get('.w-12.h-12.rounded-lg').should('be.visible');
  });

  it('should have proper layout structure', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Check main container structure
    cy.get('.bg-gray-50\\/65.backdrop-blur-sm').should('be.visible');
    cy.get('.max-w-6xl.mx-auto').should('be.visible');

    // Check white background for color picker
    cy.get('.bg-white.rounded-lg.shadow-lg').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Color Harmony Generator');

    // Click the back to library button
    cy.get('button').contains('Back to Library').should('be.visible').click();

    // Should be back at homepage
    cy.get('h1').should('contain.text', 'Project Library');
    cy.get('.min-h-\\[320px\\]').should('have.length', 7);
  });
});
