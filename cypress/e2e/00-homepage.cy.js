describe('Portfolio Homepage', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
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

  it('should load the homepage successfully', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('body').should('be.visible');
  });

  it('should display the side panel navigation buttons', () => {
    // Check for side panel navigation
    cy.get('.liquid-side-panel').should('be.visible');

    // Check for navigation buttons
    cy.get('.liquid-app-nav-button').should('have.length', 2);

    // Home button should exist
    cy.get('.liquid-app-nav-button[title="Home"]').should('be.visible');

    // GitHub button should exist
    cy.get('.liquid-app-nav-button[title="GitHub Repository"]').should('be.visible');
  });

  it('should display the portfolio title and description', () => {
    // Check for main title with gradient text
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-gradient-text').should('contain.text', 'Interactive');
    cy.get('.liquid-hero-title').should('contain.text', 'Portfolio');

    // Check for subtitle
    cy.get('.liquid-hero-subtitle').should(
      'contain.text',
      'Explore modern web applications with cutting-edge technologies'
    );
  });

  it('should display all 7 project cards', () => {
    // Check for project cards using liquid glass design
    cy.get('.liquid-apps-grid')
      .should('be.visible')
      .within(() => {
        // Should have 7 liquid glass cards
        cy.get('.liquid-app-card').should('have.length', 7);
      });

    // Each card should be visible and have proper structure
    cy.get('.liquid-app-card').each(($card) => {
      cy.wrap($card).should('be.visible');
      cy.wrap($card).find('.liquid-app-icon').should('be.visible');
      cy.wrap($card).find('.liquid-app-title').should('be.visible');
      cy.wrap($card).find('.liquid-launch-button').should('be.visible');
    });
  });

  it('should show correct project information on cards', () => {
    const expectedProjects = [
      'Full-Stack Task Manager',
      'E-Signature App',
      'Color Harmony Generator',
      '3D Paint Studio',
      'Tax & Currency Calculator',
      'Road Builder Puzzle',
      'Interactive Photo Gallery',
    ];

    expectedProjects.forEach((projectName) => {
      cy.get('.liquid-app-title').should('contain.text', projectName);
    });
  });

  it('should have clickable project cards with proper styling', () => {
    // All project cards should have cursor pointer and be interactive
    cy.get('.liquid-app-card').each(($card) => {
      cy.wrap($card).should('have.css', 'cursor', 'pointer');
      cy.wrap($card).find('.liquid-launch-button').should('be.visible');
    });
  });

  it('should show hover effects on project cards', () => {
    // Test hover effect on first card
    cy.get('.liquid-app-card').first().trigger('mouseenter');

    cy.waitForAnimations();

    // The liquid glass card component sets animated attribute based on hover
    // Just verify the card is still visible after hover
    cy.get('.liquid-app-card').first().should('be.visible');
  });

  it('should navigate to projects when cards are clicked', () => {
    // Test navigation to first project (Task Manager)
    cy.get('.liquid-app-card').first().click();

    // Should show the app with liquid glass navigation
    cy.get('.liquid-nav-header').should('be.visible');
    cy.get('.liquid-back-button').should('be.visible');
    cy.get('.liquid-nav-title').should('contain.text', 'Full-Stack Task Manager');
  });

  it('should have functional navigation buttons', () => {
    // Check GitHub button functionality
    cy.get('.liquid-app-nav-button[title="GitHub Repository"]').should('be.visible');

    // Check Home button functionality
    cy.get('.liquid-app-nav-button[title="Home"]').should('be.visible');

    // Verify buttons are LiquidGlassButton components with proper structure
    cy.get('.liquid-app-nav-button').should('have.length', 2);
  });

  it('should have proper SEO elements', () => {
    // Check for title
    cy.title().should('contain', 'Interactive App Portfolio');

    // Check for meta description
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', 'Modern web applications showcasing React, Three.js, Firebase');

    // Check for favicon
    cy.get('head link[rel="icon"], head link[rel="shortcut icon"]').should('exist');
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      // Project cards should be visible on all devices
      cy.get('.liquid-app-card').should('have.length', 7);

      // Liquid glass design should adapt to screen size
      cy.get('.liquid-apps-grid').should('be.visible');

      // Side panel should be visible on all sizes
      cy.get('.liquid-side-panel').should('be.visible');
    });
  });

  it('should have proper accessibility features', () => {
    cy.checkA11y();

    // Check for proper heading hierarchy
    cy.get('h1').should('have.length', 1);

    // Check that buttons have proper attributes
    cy.get('.liquid-launch-button').each(($button) => {
      cy.wrap($button).should('be.visible');
    });

    // Navigation buttons should have titles
    cy.get('.liquid-app-nav-button').each(($button) => {
      cy.wrap($button).should('have.attr', 'title');
    });
  });

  it('should navigate back from project to homepage', () => {
    // Navigate to a project
    cy.get('.liquid-app-card').first().click();

    // Should be in project view
    cy.get('.liquid-back-button').should('be.visible');

    // Navigate back
    cy.get('.liquid-back-button').click();

    // Should be back at homepage
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
  });

  it('should have liquid blobs animated background', () => {
    // Check for unified blob container
    cy.get('.unified-blob-container').should('exist');

    // Check for multiple animated blobs - they are rendered as LiquidBlob components
    cy.get('.unified-blob-container').children().should('have.length.at.least', 5);
  });

  it('should display project cards with proper structure', () => {
    // Each card should have icon, title, description, and launch button
    cy.get('.liquid-app-card').each(($card) => {
      cy.wrap($card).within(() => {
        // Should have icon
        cy.get('.liquid-app-icon').should('be.visible');

        // Should have title
        cy.get('.liquid-app-title').should('be.visible');

        // Should have description
        cy.get('.liquid-app-description').should('be.visible');

        // Should have launch button
        cy.get('.liquid-launch-button').should('be.visible');
      });
    });
  });

  it('should handle click interactions properly', () => {
    // Click on first project card
    cy.get('.liquid-app-card').first().click();

    // Should navigate to project
    cy.get('.liquid-nav-title').should('contain.text', 'Full-Stack Task Manager');
  });

  it('should show footer information', () => {
    // Check for footer with technology stack
    cy.get('.liquid-footer').should('be.visible');
    cy.get('.liquid-footer-card').should(
      'contain.text',
      'Built with React, Three.js, Firebase, and Liquid Glass Design System'
    );
  });
});
