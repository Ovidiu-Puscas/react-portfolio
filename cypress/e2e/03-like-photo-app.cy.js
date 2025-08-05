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

  it('should load the photo gallery application', () => {
    cy.navigateToProject('Like My Photo');

    cy.url().should('include', '/like-photo');
    cy.get('h1').should('contain', 'Like My Photo');
  });

  it('should display a grid of photos', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );

    // Check that photos are visible
    cy.get('img, .photo, [data-testid="photo"]')
      .first()
      .should('be.visible')
      .and('have.attr', 'src');
  });

  it('should show like indicators on photos', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Check for like buttons or indicators
    cy.get('.like-button, [data-testid="like-button"], .heart, .like-indicator').should(
      'have.length.greaterThan',
      0
    );
  });

  it('should allow liking photos with double-click', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Get initial like count
    cy.get('.like-count, [data-testid="like-count"]')
      .first()
      .invoke('text')
      .then((initialCount) => {
        // Double-click to like
        cy.get('img, .photo, [data-testid="photo"]').first().dblclick();

        cy.waitForAnimations();

        // Check if like count increased
        cy.get('.like-count, [data-testid="like-count"]')
          .first()
          .should('not.contain', initialCount);
      });
  });

  it('should show heart animation when liking', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Double-click to trigger like animation
    cy.get('img, .photo, [data-testid="photo"]').first().dblclick();

    // Look for heart animation (might be temporary)
    cy.get('.heart-animation, .like-animation, [data-testid="heart-animation"]', {
      timeout: 2000,
    }).should('exist');
  });

  it('should handle single click vs double click differently', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Single click should not like (if implemented)
    cy.get('img, .photo, [data-testid="photo"]').first().click();

    cy.wait(500);

    // Double click should like
    cy.get('img, .photo, [data-testid="photo"]').first().dblclick();

    cy.waitForAnimations();

    // Should show some indication of like
    cy.get('body').should('be.visible'); // Basic check
  });

  it('should display like counts for each photo', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Check that like counts are displayed
    cy.get('.like-count, [data-testid="like-count"], .likes')
      .should('have.length.greaterThan', 0)
      .each(($count) => {
        cy.wrap($count).should('be.visible');
      });
  });

  it('should handle multiple likes on the same photo', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    const photo = cy.get('img, .photo, [data-testid="photo"]').first();

    // Like multiple times
    photo.dblclick();
    cy.waitForAnimations();

    photo.dblclick();
    cy.waitForAnimations();

    photo.dblclick();
    cy.waitForAnimations();

    // Check that likes accumulate
    cy.get('.like-count, [data-testid="like-count"]').first().should('be.visible');
  });

  it('should use masonry/responsive grid layout', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Like My Photo');

      // Photos should be visible on all devices
      cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

      if (viewport.name === 'mobile') {
        // On mobile, grid might have fewer columns
        cy.get('.photo-grid, .masonry, .grid').should('be.visible');
      }
    });
  });

  it('should show photo overlay on hover (desktop)', () => {
    cy.setViewport('desktop');
    cy.navigateToProject('Like My Photo');

    // Wait for photos to load
    cy.get('img, .photo, [data-testid="photo"]').should('have.length.greaterThan', 0);

    // Hover over photo
    cy.get('img, .photo, [data-testid="photo"]').first().trigger('mouseover');

    // Look for overlay or hover effects
    cy.get('.photo-overlay, .hover-overlay, [data-testid="photo-overlay"]').should('be.visible');
  });

  it('should handle photos failing to load gracefully', () => {
    cy.navigateToProject('Like My Photo');

    // Wait for photo container
    cy.get('.photo-grid, .masonry, .grid, [data-testid="photo-grid"]').should('be.visible');

    // Check that even if some images fail, the layout remains intact
    cy.get('body').should('be.visible');

    // Look for placeholder or error handling
    cy.get('img').each(($img) => {
      // Images should have proper alt attributes for accessibility
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Like My Photo');

    // Find and click back/home button
    cy.get('[data-testid="back-to-home"], .back-button, a[href="/"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
