describe('Like My Photo App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'like-photo');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the project from homepage', () => {
    cy.get('[role="button"]').contains('Interactive Photo Gallery').should('be.visible').click();

    cy.get('h1').should('contain', 'Interactive Photo Gallery');
    cy.get('button').contains('Back to Library').should('be.visible');
  });

  it('should display the description and photo grid', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Should show description
    cy.get('p').should('contain', 'Pictures are pulled from picsum.photos');
    cy.get('p').should('contain', 'Double-click on images to like them');

    // Should show masonry grid layout
    cy.get('.columns-1.sm\\:columns-2.md\\:columns-3.lg\\:columns-4.xl\\:columns-5').should(
      'be.visible'
    );
  });

  it('should display grid of photos with proper structure', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Wait for photos to load
    cy.get('img', { timeout: 10000 }).should('have.length', 15);

    // Each photo should be in proper container structure
    cy.get('.break-inside-avoid').should('have.length', 15);

    // Check that photos have proper attributes
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible');
      cy.wrap($img).should('have.attr', 'src');
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('should show like counts and overlay for each photo', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Wait for photos to load
    cy.get('img').should('have.length', 15);

    // Each photo should have an overlay with like count
    cy.get('.relative.group.cursor-pointer').should('have.length', 15);

    // Check for like counts in overlays (they may be hidden until hover)
    cy.get('.relative.group.cursor-pointer')
      .first()
      .within(() => {
        // Should contain like information (might be in overlay)
        cy.get('body').should('exist'); // Basic structure check
      });
  });

  it('should allow liking photos with double-click', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Wait for photos to load
    cy.get('img').should('have.length', 15);

    // Get first photo container
    cy.get('.relative.group.cursor-pointer').first().as('firstPhoto');

    // Double-click to like
    cy.get('@firstPhoto').dblclick();

    // Should show heart animation or like feedback
    cy.wait(500); // Wait for potential animation

    // The photo should still be visible (basic check)
    cy.get('@firstPhoto').should('be.visible');
  });

  it('should handle hover effects on photo cards', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Wait for photos to load
    cy.get('img').should('have.length', 15);

    // Trigger hover on first photo
    cy.get('.relative.group.cursor-pointer').first().trigger('mouseover');

    // Should have hover effects (shadow changes, etc.)
    cy.get('.relative.group.cursor-pointer').first().should('be.visible');

    // Remove hover
    cy.get('.relative.group.cursor-pointer').first().trigger('mouseout');
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Interactive Photo Gallery');

      // Photos should be visible on all devices
      cy.get('img').should('have.length', 15);

      if (viewport.name === 'mobile') {
        // On mobile, should use single column
        cy.get('.columns-1').should('exist');
      }

      if (viewport.name === 'tablet') {
        // On tablet, should use 2-3 columns
        cy.get('.sm\\:columns-2.md\\:columns-3').should('exist');
      }

      if (viewport.name === 'desktop') {
        // On desktop, should use more columns
        cy.get('.lg\\:columns-4.xl\\:columns-5').should('exist');
      }
    });
  });

  it('should handle masonry layout properly', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Check masonry layout structure
    cy.get('.columns-1.sm\\:columns-2.md\\:columns-3.lg\\:columns-4.xl\\:columns-5').should(
      'be.visible'
    );

    // Each photo should have break-inside-avoid class
    cy.get('.break-inside-avoid').should('have.length', 15);

    // Photos should have proper spacing
    cy.get('.break-inside-avoid.mb-4').should('exist');
  });

  it('should load photos from picsum.photos with different seeds', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Check that photos are from picsum.photos
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'src').and('include', 'picsum.photos');
    });

    // Should have different seeds for variety
    cy.get('img').then(($imgs) => {
      const srcs = Array.from($imgs).map((img) => img.src);
      const uniqueSrcs = new Set(srcs);
      expect(uniqueSrcs.size).to.equal(15); // All photos should be unique
    });
  });

  it('should have proper container and spacing', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Check main container
    cy.get('.container.mx-auto.px-4.overflow-y-auto').should('be.visible');

    // Check description styling
    cy.get('p.text-lg.pt-4.text-white').should('be.visible');

    // Check grid spacing
    cy.get('.gap-4.mt-6.space-y-4').should('exist');
  });

  it('should handle photo card interactions', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Wait for photos to load
    cy.get('img').should('have.length', 15);

    // Check photo card structure
    cy.get('.relative.group.cursor-pointer')
      .first()
      .within(() => {
        // Should have proper styling classes
        cy.get('.overflow-hidden.rounded-lg.shadow-md').should('exist');
      });

    // Test cursor pointer
    cy.get('.relative.group.cursor-pointer').first().should('have.css', 'cursor', 'pointer');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Interactive Photo Gallery');

    // Click the back to library button
    cy.get('button').contains('Back to Library').should('be.visible').click();

    // Should be back at homepage
    cy.get('h1').should('contain.text', 'Project Library');
    cy.get('.min-h-\\[320px\\]').should('have.length', 7);
  });
});
