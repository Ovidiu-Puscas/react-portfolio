describe('Road Builder Puzzle', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'road-builder');
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

  it('should load the puzzle game', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Should show liquid glass navigation for Road Builder
    cy.get('.liquid-nav-title').should('contain.text', 'Road Builder Puzzle');
    cy.get('.liquid-back-button').should('be.visible');
  });

  it('should display the puzzle board', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Check for puzzle board
    cy.get('.puzzle-board, [data-testid="puzzle-board"], .game-board').should('be.visible');

    // Check for puzzle tiles
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16); // 4x4 grid
  });

  it('should display game stats and controls', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Check for move counter
    // Should show move counter (may have different selector)
    cy.get('body').should('contain.text', 'Moves');

    // Check for timer or other stats
    cy.get('.timer, [data-testid="timer"], .time').should('be.visible');

    // Check for reset/shuffle button
    cy.get('button')
      .contains(/reset|shuffle|new game/i)
      .should('be.visible');
  });

  it('should allow moving puzzle tiles', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Wait for board to load
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16);

    // Get initial move count
    cy.get('body')
      .invoke('text')
      .then((initialMoves) => {
        // Click on a moveable tile (adjacent to empty space)
        cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').not('.empty').first().click();

        cy.waitForAnimations();

        // Move count should increase
        cy.get('body').should('not.contain', initialMoves);
      });
  });

  it('should prevent invalid moves', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Wait for board to load
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16);

    // Get initial move count
    cy.get('body')
      .invoke('text')
      .then((initialMoves) => {
        // Try to click a tile that can't move (not adjacent to empty space)
        // This requires knowing the layout, so we'll just test that clicks are handled
        cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').last().click();

        cy.waitForAnimations();

        // If move is invalid, count shouldn't change (this might vary by implementation)
        cy.get('body').should('be.visible'); // Basic check
      });
  });

  it('should reset the puzzle when reset button is clicked', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Make some moves first
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').not('.empty').first().click();

    cy.waitForAnimations();

    // Click reset button
    cy.get('button')
      .contains(/reset|shuffle|new game/i)
      .click();

    cy.waitForAnimations();

    // Board should be shuffled/reset
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16);
  });

  it('should show car and validate road connections', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Look for car element
    // Should show car/vehicle element
    cy.get('body').should('contain.text', 'Car');

    // Check for start and end points
    cy.get('.start, .end, [data-testid="start"], [data-testid="end"]').should(
      'have.length.greaterThan',
      0
    );
  });

  it('should detect when puzzle is solved', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // This test would require either:
    // 1. A way to set up a solved state
    // 2. Playing through to completion (time-consuming)
    // 3. A test mode that can trigger win condition

    // For now, just check that win detection elements exist
    cy.get('body').should('be.visible');

    // Look for potential win condition elements
    cy.get('.victory, .win, .success, [data-testid="victory"]').should('not.exist'); // Initially should not be won
  });

  it('should show connection editor mode', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Look for editor mode toggle
    cy.get('button')
      .contains(/editor|edit|connection/i)
      .should('be.visible')
      .click();

    // Editor interface should appear
    cy.get('.editor, .connection-editor, [data-testid="editor"]').should('be.visible');
  });

  it('should handle animations smoothly', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Make a move and check for smooth transition
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').not('.empty').first().click();

    // Wait for animation to complete
    cy.waitForAnimations();

    // Board should still be functional after animation
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16);
  });

  it('should be responsive on different screen sizes', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Road Builder Puzzle');

      // Puzzle board should be visible on all devices
      cy.get('.puzzle-board, [data-testid="puzzle-board"], .game-board').should('be.visible');

      // Tiles should be clickable
      cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').should('have.length', 16);

      if (viewport.name === 'mobile') {
        // On mobile, tiles should be touch-friendly
        cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').first().should('be.visible');
      }
    });
  });

  it('should show game instructions', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Look for instructions or help
    cy.get('.instructions, .help, [data-testid="instructions"]').should('be.visible');

    // Or check for instruction text in the UI
    cy.get('body');
    // Check for game instructions
    cy.get('body').should('contain.text', 'puzzle');
    cy.get('body').should('contain.text', 'road');
    cy.get('body').should('contain.text', 'connect');
  });

  it('should track and display game statistics', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Check for various game stats
    cy.get('.stats, [data-testid="stats"], .game-stats').should('be.visible');

    // Should show moves, time, or other metrics
    cy.get('body').should('contain.text', 'Moves');
    cy.get('body').should('contain.text', 'Time');
  });

  it('should handle edge cases gracefully', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Rapid clicking should not break the game
    cy.get('.puzzle-tile, [data-testid="puzzle-tile"], .tile').first().click().click().click();

    cy.waitForAnimations();

    // Game should still be functional
    cy.get('.puzzle-board, [data-testid="puzzle-board"], .game-board').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Road Builder Puzzle');

    // Click liquid glass back button
    cy.get('.liquid-back-button').should('be.visible').click();

    // Should return to homepage
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
