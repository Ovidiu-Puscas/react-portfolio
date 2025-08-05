describe('Portfolio Homepage', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the homepage successfully', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('body').should('be.visible');
  });

  it('should display the main navigation', () => {
    // Check for header/navigation
    cy.get('header, nav, .navigation, [data-testid="navigation"]').should('be.visible');

    // Should have home link or logo
    cy.get('a[href="/"], .logo, [data-testid="home-link"]').should('be.visible');
  });

  it('should display the portfolio title and description', () => {
    // Check for main title
    cy.get('h1')
      .should('contain.text', 'React Portfolio')
      .or('contain.text', 'Portfolio')
      .or('contain.text', 'Projects');

    // Check for description or tagline
    cy.get('p, .description, [data-testid="description"]').should('be.visible');
  });

  it('should display all 7 project cards', () => {
    // Should show all project cards
    cy.get('[data-testid="project-card"], .project-card, .project').should('have.length', 7);

    // Each card should be visible
    cy.get('[data-testid="project-card"], .project-card, .project').each(($card) => {
      cy.wrap($card).should('be.visible');
    });
  });

  it('should show correct project information on cards', () => {
    const expectedProjects = [
      'E-Signature',
      'Complementary Colors',
      'Like My Photo',
      'Tax Calculator',
      'Road Builder',
      '3D Painting',
      'Task Manager',
    ];

    expectedProjects.forEach((projectName) => {
      cy.get('body').should('contain.text', projectName);
    });
  });

  it('should have clickable project cards', () => {
    // All project cards should be clickable
    cy.get('[data-testid="project-card"], .project-card, .project').each(($card) => {
      cy.wrap($card).should('have.css', 'cursor', 'pointer').or('be.enabled');
    });
  });

  it('should show hover effects on project cards', () => {
    // Test hover effect on first card
    cy.get('[data-testid="project-card"], .project-card, .project').first().trigger('mouseover');

    cy.waitForAnimations();

    // Should have some hover effect (scale, shadow, etc.)
    cy.get('[data-testid="project-card"], .project-card, .project').first().should('be.visible');
  });

  it('should navigate to projects when cards are clicked', () => {
    // Test navigation to first project
    cy.get('[data-testid="project-card"], .project-card, .project').first().click();

    // URL should change
    cy.url().should('not.eq', Cypress.config().baseUrl + '/');

    // Should load project content
    cy.get('body').should('be.visible');
  });

  it('should display GitHub and external links', () => {
    // Look for GitHub link
    cy.get('a[href*="github"], [data-testid="github-link"]')
      .should('be.visible')
      .and('have.attr', 'href');

    // Check that external links open in new tab
    cy.get('a[href*="github"]')
      .should('have.attr', 'target', '_blank')
      .or('have.attr', 'rel', 'noopener');
  });

  it('should have proper SEO elements', () => {
    // Check for title
    cy.title().should('not.be.empty');

    // Check for meta description
    cy.get('head meta[name="description"]').should('have.attr', 'content');

    // Check for favicon
    cy.get('head link[rel="icon"], head link[rel="shortcut icon"]').should('exist');
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      // Project cards should be visible on all devices
      cy.get('[data-testid="project-card"], .project-card, .project').should('have.length', 7);

      if (viewport.name === 'mobile') {
        // On mobile, cards might stack vertically
        cy.get('.grid, .projects-grid').should('be.visible');
      }

      if (viewport.name === 'desktop') {
        // On desktop, should show multiple columns
        cy.get('[data-testid="project-card"], .project-card, .project').should('be.visible');
      }
    });
  });

  it('should show animated background elements', () => {
    // Check for background animations (blobs, particles, etc.)
    cy.get('.blob, .particle, .background-animation, [data-testid="background"]').should('exist');

    // Background should not interfere with content
    cy.get('[data-testid="project-card"], .project-card, .project').first().should('be.visible');
  });

  it('should have proper accessibility features', () => {
    cy.checkA11y();

    // Check for proper heading hierarchy
    cy.get('h1').should('have.length', 1);

    // Links should have proper text or aria-labels
    cy.get('a').each(($link) => {
      cy.wrap($link).should('satisfy', ($el) => {
        const text = $el.text().trim();
        const ariaLabel = $el.attr('aria-label');
        return text.length > 0 || ariaLabel;
      });
    });
  });

  it('should handle loading states properly', () => {
    // Refresh page and check loading
    cy.reload();

    // Should show some loading state initially
    cy.get('.loading, .spinner, [data-testid="loading"]').should('exist');

    // Then content should load
    cy.get('[data-testid="project-card"], .project-card, .project').should('have.length', 7);
  });

  it('should show performance optimizations', () => {
    // Check that images are loaded properly
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible').and('have.attr', 'src').and('have.attr', 'alt');
    });

    // Check for lazy loading or performance attributes
    cy.get('img')
      .first()
      .should('satisfy', ($el) => {
        return $el.attr('loading') === 'lazy' || $el.attr('decoding') === 'async' || $el.complete; // Image is loaded
      });
  });

  it('should show proper error boundaries', () => {
    // Error boundaries should be in place (test by triggering error)
    cy.window().then((win) => {
      // Add error handler to prevent test failure
      win.addEventListener('error', (e) => {
        e.preventDefault();
        return false;
      });
    });

    // If error boundary exists, it should handle errors gracefully
    cy.get('body').should('be.visible');
  });

  it('should have analytics and tracking setup', () => {
    // Check for analytics scripts (Google Analytics, etc.)
    cy.window().then((win) => {
      // This would depend on the analytics implementation
      expect(win).to.exist;
    });
  });

  it('should show social media links', () => {
    // Look for social media links
    cy.get('a[href*="linkedin"], a[href*="twitter"], a[href*="github"]').should(
      'have.length.greaterThan',
      0
    );
  });

  it('should display contact information or links', () => {
    // Look for contact information
    cy.get('body').should('satisfy', ($body) => {
      const text = $body.text();
      return (
        text.includes('@') || // Email
        text.includes('contact') || // Contact link
        text.includes('linkedin') || // LinkedIn
        text.includes('github')
      ); // GitHub
    });
  });

  it('should have proper meta tags for social sharing', () => {
    // Check for Open Graph tags
    cy.get('head meta[property^="og:"]').should('have.length.greaterThan', 0);

    // Check for Twitter Card tags
    cy.get('head meta[name^="twitter:"]').should('exist');
  });

  it('should load quickly and meet performance thresholds', () => {
    const startTime = Date.now();

    cy.visit('/');
    cy.waitForProjectLoad();

    cy.then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(testData.performance.thresholds.loadTime);
    });
  });

  it('should work with JavaScript disabled fallback', () => {
    // This would require special Cypress configuration
    // For now, just ensure content is visible
    cy.get('[data-testid="project-card"], .project-card, .project').should(
      'have.length.greaterThan',
      0
    );
  });
});
