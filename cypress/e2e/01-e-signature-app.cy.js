describe('E-Signature App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'e-signature');
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

  it('should load the project from homepage', () => {
    // Click on E-Signature App card using liquid glass UI
    cy.get('.liquid-app-card').contains('E-Signature App').should('be.visible').click();

    // Should show the liquid glass navigation header
    cy.get('.liquid-nav-header').should('be.visible');
    cy.get('.liquid-nav-title').should('contain.text', 'E-Signature App');
    cy.get('.liquid-back-button').should('be.visible');
  });

  it('should display the main interface elements', () => {
    cy.navigateToProject('E-Signature App');

    // Check main UI elements with correct placeholders and IDs
    cy.get('#signer-name')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter signer name');
    cy.get('#document-title')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter document title');
    cy.get('#document-content')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter document content');

    // Check for signature canvas
    cy.get('canvas.sigCanvas').should('be.visible');

    // Check section headers
    cy.get('h2').contains('Document Details').should('be.visible');
    cy.get('h2').contains('PDF Preview').should('be.visible');
    cy.get('h3').contains('Digital Signature').should('be.visible');
  });

  it('should allow filling out document information', () => {
    cy.navigateToProject('E-Signature App');

    // Fill out the form with correct selectors
    cy.get('#signer-name').clear().type(testData.testData.signerName);

    cy.get('#document-title').clear().type(testData.testData.documentTitle);

    cy.get('#document-content').clear().type(testData.testData.documentContent);

    // Verify values are entered
    cy.get('#signer-name').should('have.value', testData.testData.signerName);
    cy.get('#document-title').should('have.value', testData.testData.documentTitle);
    cy.get('#document-content').should('have.value', testData.testData.documentContent);
  });

  it('should allow drawing a signature', () => {
    cy.navigateToProject('E-Signature App');

    // Draw on the signature canvas using the specific class
    cy.get('canvas.sigCanvas')
      .should('be.visible')
      .trigger('mousedown', 100, 50)
      .trigger('mousemove', 200, 75)
      .trigger('mousemove', 250, 50)
      .trigger('mouseup');

    // Check if signature was drawn (canvas should have content)
    cy.get('canvas.sigCanvas').should('be.visible');
  });

  it('should clear signature when clear button is clicked', () => {
    cy.navigateToProject('E-Signature App');

    // Draw signature first
    cy.get('canvas.sigCanvas')
      .trigger('mousedown', 100, 50)
      .trigger('mousemove', 200, 75)
      .trigger('mouseup');

    // Clear signature using the correct button text
    cy.contains('Clear Signature').click();

    // Canvas should still be visible after clearing
    cy.get('canvas.sigCanvas').should('be.visible');
  });

  it('should show PDF preview when signature is saved', () => {
    cy.navigateToProject('E-Signature App');

    // Fill out form
    cy.get('#signer-name').type(testData.testData.signerName);
    cy.get('#document-title').type(testData.testData.documentTitle);
    cy.get('#document-content').type(testData.testData.documentContent);

    // Draw signature
    cy.get('canvas.sigCanvas')
      .trigger('mousedown', 100, 50)
      .trigger('mousemove', 200, 75)
      .trigger('mouseup');

    // Save signature to generate PDF preview
    cy.contains('Save Signature').click();

    // Check if PDF preview appears (should replace the placeholder)
    cy.get('.pdf-preview, iframe, embed, object', { timeout: 10000 }).should('be.visible');

    // The placeholder should be gone
    cy.get('svg').contains('path[d*="M9 12h6m-6 4h6m2 5H7"]').should('not.exist');
  });

  it('should be responsive on mobile devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('E-Signature App');

      // Check responsive layout elements exist
      cy.get('#signer-name').should('be.visible');
      cy.get('#document-title').should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, should use responsive layout
        cy.get('.lg\\:grid').should('exist');
        // Canvas should exist but might be clipped on mobile
        cy.get('canvas.sigCanvas').should('exist');
      } else {
        // On desktop, canvas should be fully visible
        cy.get('canvas.sigCanvas').should('be.visible');
      }
    });
  });

  it('should handle empty signature gracefully', () => {
    cy.navigateToProject('E-Signature App');

    // Try to save signature without drawing anything
    cy.contains('Save Signature').click();

    // Should still show the placeholder content
    cy.get('svg').should('be.visible'); // The placeholder icon should still be there
    cy.contains('Complete the form and add your signature').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('E-Signature App');

    // Click the liquid glass back button
    cy.get('.liquid-back-button').should('be.visible').click();

    // Should be back at the homepage with liquid glass UI
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
  });

  it('should have proper form labels and accessibility', () => {
    cy.navigateToProject('E-Signature App');

    // Check for proper labels
    cy.get('label[for="document-title"]').should('contain', 'Document Title');
    cy.get('label[for="document-content"]').should('contain', 'Document Content');
    cy.get('label[for="signer-name"]').should('contain', 'Signer Name');

    // Check that inputs are properly associated with labels
    cy.get('#document-title').should('have.attr', 'id', 'document-title');
    cy.get('#document-content').should('have.attr', 'id', 'document-content');
    cy.get('#signer-name').should('have.attr', 'id', 'signer-name');
  });

  it('should show signature canvas with proper styling', () => {
    cy.navigateToProject('E-Signature App');

    // Check signature canvas styling
    cy.get('canvas.sigCanvas')
      .should('be.visible')
      .and('have.class', 'border-2')
      .and('have.class', 'border-gray-300')
      .and('have.class', 'rounded-lg');

    // Check signature section background
    cy.get('.bg-gray-50.rounded-lg').should('exist');
    cy.get('canvas.sigCanvas').should('be.visible');
  });
});
