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

  it('should display the top-right navigation links', () => {
    // Check for GitHub link in top-right navigation
    cy.get('a[href*="github.com/Ovidiu-Puscas/react-portfolio"]')
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');

    // Check for Home link in top-right navigation
    cy.get('a[href="https://xtreemedigital.com/"]')
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('should display the portfolio title and description', () => {
    // Check for main title "Project Library"
    cy.get('h1').should('contain.text', 'Project Library');

    // Check for description
    cy.get('p').should('contain.text', 'Explore my collection of React applications');
  });

  it('should display all 7 project cards', () => {
    // Check for project cards using the grid structure
    cy.get('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      .should('be.visible')
      .within(() => {
        // Should have 7 project cards
        cy.get('.min-h-\\[320px\\]').should('have.length', 7);
      });

    // Each card should be visible and clickable
    cy.get('.min-h-\\[320px\\]').each(($card) => {
      cy.wrap($card).should('be.visible');
      cy.wrap($card).find('[role="button"]').should('be.visible');
    });
  });

  it('should show correct project information on cards', () => {
    const expectedProjects = [
      'Full-Stack Task Manager',
      'E-Signature App',
      'Color Harmony Generator',
      '3D Canvas Painter',
      'Romanian Tax Calculator',
      'Road Builder Puzzle',
      'Interactive Photo Gallery',
    ];

    expectedProjects.forEach((projectName) => {
      cy.get('body').should('contain.text', projectName);
    });
  });

  it('should have clickable project cards with proper styling', () => {
    // All project cards should have cursor pointer and be interactive
    cy.get('[role="button"]').each(($card) => {
      cy.wrap($card).should('have.css', 'cursor', 'pointer');
      cy.wrap($card).should('have.attr', 'tabindex', '0');
    });
  });

  it('should show hover effects on project cards', () => {
    // Test hover effect on first card
    cy.get('[role="button"]').first().trigger('mouseover');

    cy.waitForAnimations();

    // Should have hover effects (the component has hover:scale-[1.02] and hover:shadow-xl)
    cy.get('[role="button"]').first().should('be.visible');
  });

  it('should navigate to projects when cards are clicked', () => {
    // Test navigation to first project (Task Manager)
    cy.get('[role="button"]').first().click();

    // Should show the task manager app with header
    cy.get('.bg-white.shadow-sm.border-b').should('be.visible');
    cy.get('button').contains('Back to Library').should('be.visible');
    cy.get('h1').should('contain.text', 'Full-Stack Task Manager');
  });

  it('should display GitHub and Home links with proper attributes', () => {
    // Check GitHub link
    cy.get('a[href*="github.com"]')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');

    // Check Home link
    cy.get('a[href*="xtreemedigital.com"]')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('should have proper SEO elements', () => {
    // Check for title
    cy.title().should('contain', 'React Portfolio - Interactive Web Applications');

    // Check for meta description
    cy.get('head meta[name="description"]').should('have.attr', 'content');

    // Check for favicon
    cy.get('head link[rel="icon"], head link[rel="shortcut icon"]').should('exist');
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      // Project cards should be visible on all devices
      cy.get('.min-h-\\[320px\\]').should('have.length', 7);

      if (viewport.name === 'mobile') {
        // On mobile, grid should use single column
        cy.get('.grid-cols-1').should('exist');
      }

      if (viewport.name === 'desktop') {
        // On desktop, should show multiple columns
        cy.get('.lg\\:grid-cols-3').should('exist');
      }
    });
  });

  it('should have proper accessibility features', () => {
    cy.checkA11y();

    // Check for proper heading hierarchy
    cy.get('h1').should('have.length', 1);

    // Check that project cards have proper keyboard navigation
    cy.get('[role="button"]').each(($button) => {
      cy.wrap($button).should('have.attr', 'tabindex', '0');
    });

    // Links should have proper text
    cy.get('a').each(($link) => {
      cy.wrap($link).should('satisfy', ($el) => {
        const text = $el.text().trim();
        const title = $el.attr('title');
        return text.length > 0 || title;
      });
    });
  });

  it('should navigate back from project to homepage', () => {
    // Navigate to a project
    cy.get('[role="button"]').first().click();

    // Should be in project view
    cy.get('button').contains('Back to Library').should('be.visible');

    // Navigate back
    cy.get('button').contains('Back to Library').click();

    // Should be back at homepage
    cy.get('h1').should('contain.text', 'Project Library');
    cy.get('.min-h-\\[320px\\]').should('have.length', 7);
  });

  it('should have proper gradient background and styling', () => {
    // Check main background gradient
    cy.get('.bg-gradient-to-br.from-gray-50').should('be.visible');

    // Check gradient separator line
    cy.get('.bg-gradient-to-r.from-blue-500.to-purple-500').should('be.visible');
  });

  it('should display project cards with proper structure', () => {
    // Each card should have icon, title, description, and action indicator
    cy.get('[role="button"]').each(($card) => {
      cy.wrap($card).within(() => {
        // Should have icon container
        cy.get('.bg-white\\/20.rounded-xl').should('be.visible');

        // Should have title (h3)
        cy.get('h3').should('be.visible');

        // Should have action indicator at bottom
        cy.get('svg').should('exist');
      });
    });
  });

  it('should handle keyboard navigation properly', () => {
    // Focus on first project card
    cy.get('[role="button"]').first().focus();

    // Press Enter to activate
    cy.get('[role="button"]').first().type('{enter}');

    // Should navigate to project
    cy.get('h1').should('contain.text', 'Full-Stack Task Manager');
  });

  it('should show footer information', () => {
    // Check for footer text
    cy.get('body').should('contain.text', 'More projects coming soon!');
  });
});
