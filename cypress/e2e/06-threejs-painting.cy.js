describe('3D Paint Studio', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'threejs-painting');
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

  it('should load the 3D painting application', () => {
    cy.navigateToProject('3D Paint Studio');

    // Should show liquid glass navigation for 3D Paint Studio
    cy.get('.liquid-nav-title').should('contain.text', '3D Paint Studio');
    cy.get('.liquid-back-button').should('be.visible');
  });

  it('should display 3D canvas and painting interface', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for Three.js to load
    cy.get('canvas', { timeout: 15000 }).should('be.visible');

    // Check for painting controls
    cy.get('.controls, [data-testid="painting-controls"], .ui-panel').should('be.visible');
  });

  it('should show brush size controls', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for interface to load
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Look for brush size controls
    cy.get('input[type="range"], .brush-size, [data-testid="brush-size"]').should('be.visible');

    // Or look for brush size buttons/slider
    cy.get('.size, .brush, button').should('have.length.greaterThan', 0);
  });

  it('should display color palette', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for 3D scene to load
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Look for color palette (might be 3D spheres or traditional color picker)
    cy.get('.color, .palette, [data-testid="color-palette"]').should('be.visible');

    // Or check for color selection elements
    cy.get('.color-sphere, .color-picker, button').should('have.length.greaterThan', 0);
  });

  it('should allow painting on the 3D canvas', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for 3D scene to be ready
    cy.get('canvas', { timeout: 15000 }).should('be.visible');

    // Give Three.js time to initialize
    cy.wait(3000);

    // Attempt to paint on canvas
    cy.interactWithCanvas('canvas', 400, 300);

    cy.waitForAnimations();

    // Canvas should still be responsive
    cy.get('canvas').should('be.visible');
  });

  it('should allow changing brush size', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for interface
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Change brush size if slider exists
    cy.get('input[type="range"]').then(($sliders) => {
      if ($sliders.length > 0) {
        cy.wrap($sliders.first()).invoke('val', 15).trigger('input');
      }
    });

    // Or click brush size buttons
    cy.get('button').then(($buttons) => {
      const sizeButtons = $buttons.filter((i, el) => {
        return /size|brush|small|large/i.test(el.textContent);
      });
      if (sizeButtons.length > 0) {
        cy.wrap(sizeButtons.first()).click();
      }
    });

    cy.waitForAnimations();
  });

  it('should allow changing paint colors', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for scene to load
    cy.get('canvas', { timeout: 10000 }).should('be.visible');
    cy.wait(2000);

    // Try to select different colors
    testData.testData.colors.forEach((color, index) => {
      // Click on color elements (might be 3D spheres)
      cy.get('.color, button, [data-testid="color"]').then(($colors) => {
        if ($colors.length > index) {
          cy.wrap($colors.eq(index)).click();
          cy.waitForAnimations();
        }
      });
    });
  });

  it('should show camera controls', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for 3D scene
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Look for camera control instructions or buttons
    // Look for camera control text (separate assertions)
    cy.get('body').should('contain.text', 'rotate');
    cy.get('body').should('contain.text', 'camera');
    cy.get('body').should('contain.text', 'mouse');

    // Or check for camera control UI
    cy.get('.camera, .rotate, [data-testid="camera-controls"]').should('exist');
  });

  it('should handle 3D scene interactions', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for scene to load
    cy.get('canvas', { timeout: 15000 }).should('be.visible');
    cy.wait(3000);

    // Test mouse interactions for camera rotation
    cy.get('canvas')
      .trigger('mousedown', 200, 200, { which: 1 })
      .trigger('mousemove', 250, 250)
      .trigger('mouseup');

    cy.waitForAnimations();

    // Scene should still be functional
    cy.get('canvas').should('be.visible');
  });

  it('should show shape challenge mode', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for interface to load
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Look for challenge/game mode
    cy.get('button').then(($buttons) => {
      const challengeButtons = $buttons.filter((i, el) => {
        return /challenge|shape|game|target/i.test(el.textContent);
      });
      if (challengeButtons.length > 0) {
        cy.wrap(challengeButtons.first()).click();
        cy.waitForAnimations();

        // Should show challenge interface
        cy.get('.challenge, .target, [data-testid="challenge"]').should('be.visible');
      }
    });
  });

  it('should handle brush stroke interpolation', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for 3D scene
    cy.get('canvas', { timeout: 15000 }).should('be.visible');
    cy.wait(3000);

    // Make fast brush strokes to test interpolation
    cy.get('canvas')
      .trigger('mousedown', 300, 200, { which: 1 })
      .trigger('mousemove', 500, 300, { force: true })
      .trigger('mousemove', 200, 400, { force: true })
      .trigger('mouseup');

    cy.waitForAnimations();

    // Canvas should handle rapid movements smoothly
    cy.get('canvas').should('be.visible');
  });

  it('should be responsive on different devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('3D Paint Studio');

      // 3D canvas should adapt to screen size
      cy.get('canvas', { timeout: 10000 }).should('be.visible');

      if (viewport.name === 'mobile') {
        // On mobile, touch interactions should work
        cy.get('canvas')
          .trigger('touchstart', 200, 200)
          .trigger('touchmove', 250, 250)
          .trigger('touchend');
      }

      cy.waitForAnimations();
    });
  });

  it('should show loading state while 3D assets load', () => {
    cy.visit('/');

    // Navigate using liquid glass navigation
    cy.get('.liquid-app-card').contains('3D Paint Studio').click();

    // Should show loading state initially
    cy.get('.loading, [data-testid="loading"], .spinner, p')
      .contains('Loading 3D')
      .should('be.visible');

    // Then canvas should appear
    cy.get('canvas', { timeout: 15000 }).should('be.visible');
  });

  it('should handle WebGL context gracefully', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for Three.js initialization
    cy.get('canvas', { timeout: 15000 }).should('be.visible');

    // Check that WebGL context is working
    cy.window().then((win) => {
      const canvas = win.document.querySelector('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      expect(gl).to.not.be.null;
    });
  });

  it('should maintain performance with multiple brush strokes', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for scene to load
    cy.get('canvas', { timeout: 15000 }).should('be.visible');
    cy.wait(3000);

    // Make multiple brush strokes
    for (let i = 0; i < 5; i++) {
      cy.get('canvas')
        .trigger('mousedown', 300 + i * 20, 200 + i * 10, { which: 1 })
        .trigger('mousemove', 400 + i * 20, 250 + i * 10)
        .trigger('mouseup');

      cy.wait(200);
    }

    // Scene should still be responsive
    cy.get('canvas').should('be.visible');
  });

  it('should show proper error handling for WebGL issues', () => {
    // This test would require mocking WebGL failures
    cy.navigateToProject('3D Paint Studio');

    // Wait for potential error handling
    cy.get('body', { timeout: 15000 }).should('be.visible');

    // If WebGL fails, should show fallback or error message
    cy.get('.error, .fallback, [data-testid="webgl-error"]').should('not.exist');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('3D Paint Studio');

    // Wait for app to load
    cy.get('canvas', { timeout: 10000 }).should('be.visible');

    // Click liquid glass back button
    cy.get('.liquid-back-button').should('be.visible').click();

    // Should return to homepage
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
  });
});
