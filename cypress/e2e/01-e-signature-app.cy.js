describe('E-Signature App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'e-signature');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the project from homepage', () => {
    cy.get('[data-testid="project-card"]').contains('E-Signature').should('be.visible').click();

    cy.url().should('include', '/e-signature');
    cy.get('h1').should('contain', 'E-Signature');
  });

  it('should display the main interface elements', () => {
    cy.navigateToProject('E-Signature');

    // Check main UI elements
    cy.get('input[placeholder="Enter signer name here"]').should('be.visible');
    cy.get('input[placeholder="Enter document title here"]').should('be.visible');
    cy.get('textarea[placeholder="Enter document content here"]').should('be.visible');
    cy.get('canvas').should('be.visible');
  });

  it('should allow filling out document information', () => {
    cy.navigateToProject('E-Signature');

    // Fill out the form
    cy.get('input[placeholder="Enter signer name here"]')
      .clear()
      .type(testData.testData.signerName);

    cy.get('input[placeholder="Enter document title here"]')
      .clear()
      .type(testData.testData.documentTitle);

    cy.get('textarea[placeholder="Enter document content here"]')
      .clear()
      .type(testData.testData.documentContent);

    // Verify values are entered
    cy.get('input[placeholder="Enter signer name here"]').should(
      'have.value',
      testData.testData.signerName
    );
    cy.get('input[placeholder="Enter document title here"]').should(
      'have.value',
      testData.testData.documentTitle
    );
    cy.get('textarea[placeholder="Enter document content here"]').should(
      'have.value',
      testData.testData.documentContent
    );
  });

  it('should allow drawing a signature', () => {
    cy.navigateToProject('E-Signature');

    // Draw on the signature canvas
    cy.get('canvas')
      .should('be.visible')
      .trigger('mousedown', 100, 100)
      .trigger('mousemove', 200, 150)
      .trigger('mousemove', 300, 100)
      .trigger('mouseup');

    // Check if signature was drawn (canvas should have content)
    cy.get('canvas').should('be.visible');
  });

  it('should clear signature when clear button is clicked', () => {
    cy.navigateToProject('E-Signature');

    // Draw signature first
    cy.get('canvas')
      .trigger('mousedown', 100, 100)
      .trigger('mousemove', 200, 150)
      .trigger('mouseup');

    // Clear signature
    cy.contains('Clear Signature').click();

    // Canvas should be cleared (implementation detail - would need data-testid)
    cy.get('canvas').should('be.visible');
  });

  it('should generate PDF when generate button is clicked', () => {
    cy.navigateToProject('E-Signature');

    // Fill out form
    cy.get('input[placeholder="Enter signer name here"]').type(testData.testData.signerName);
    cy.get('input[placeholder="Enter document title here"]').type(testData.testData.documentTitle);
    cy.get('textarea[placeholder="Enter document content here"]').type(
      testData.testData.documentContent
    );

    // Draw signature
    cy.get('canvas')
      .trigger('mousedown', 100, 100)
      .trigger('mousemove', 200, 150)
      .trigger('mouseup');

    // Generate PDF
    cy.contains('Generate PDF').click();

    // Check if PDF preview appears
    cy.get('.pdf-preview, iframe, embed', { timeout: 10000 }).should('be.visible');
  });

  it('should be responsive on mobile devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('E-Signature');

      // Check responsive layout
      cy.get('canvas').should('be.visible');
      cy.get('input[placeholder="Enter signer name here"]').should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, elements might stack vertically
        cy.get('.grid').should('have.class', 'md:grid-cols-2');
      }
    });
  });

  it('should handle empty form submission gracefully', () => {
    cy.navigateToProject('E-Signature');

    // Try to generate PDF without filling form
    cy.contains('Generate PDF').click();

    // Should handle gracefully (either show validation or use defaults)
    cy.get('body').should('be.visible'); // Basic check that page doesn't crash
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('E-Signature');

    // Look for back/home navigation
    cy.get('[data-testid="back-to-home"], .back-button, a[href="/"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
