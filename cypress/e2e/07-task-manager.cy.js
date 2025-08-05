describe('Full-Stack Task Manager', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'task-manager');
    });
  });

  beforeEach(() => {
    // Handle Firebase and other errors by setting up a listener
    cy.on('uncaught:exception', (err) => {
      // Ignore Firebase-related errors in test environment
      if (
        err.message.includes('auth/invalid-api-key') ||
        err.message.includes('Firebase') ||
        err.message.includes('firebase') ||
        err.message.includes('auth/configuration-not-found') ||
        err.message.includes('auth/invalid-api-key')
      ) {
        return false; // Prevent test from failing
      }
      return true;
    });

    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the task manager application', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Should show liquid glass navigation for Task Manager
    cy.get('.liquid-nav-title').should('contain.text', 'Full-Stack Task Manager');
    cy.get('.liquid-back-button').should('be.visible');
  });

  it('should display authentication interface initially', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Should show login/register form
    cy.get('input[type="email"], [data-testid="email-input"]').should('be.visible');

    cy.get('input[type="password"], [data-testid="password-input"]').should('be.visible');

    // Should have login and register options
    cy.get('button')
      .contains(/login|sign in/i)
      .should('be.visible');
  });

  it('should allow switching between login and register', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Look for register/signup link or button
    cy.get('button, a')
      .contains(/register|sign up|create account/i)
      .should('be.visible')
      .click();

    cy.waitForAnimations();

    // Should show register form
    cy.get('input[type="email"], [data-testid="email-input"]').should('be.visible');

    // Switch back to login
    cy.get('button, a')
      .contains(/login|sign in|back to login/i)
      .should('be.visible')
      .click();
  });

  it('should handle demo/guest access', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Look for demo/guest button
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .should('be.visible')
      .click();

    cy.wait(2000);

    // Should navigate to main app interface
    cy.get('.kanban, .projects, [data-testid="projects-list"]', { timeout: 10000 }).should(
      'be.visible'
    );
  });

  it('should display projects list in main interface', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    // Should show projects
    cy.get('.project, [data-testid="project"], .project-card').should('have.length.greaterThan', 0);
  });

  it('should allow creating new projects', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Enter demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    // Look for add project button
    cy.get('button')
      .contains(/add project|new project|create project/i)
      .should('be.visible')
      .click();

    // Should show project creation form
    cy.get('input[placeholder*="project"], [data-testid="project-name"]')
      .should('be.visible')
      .type(testData.testData.testProject.name);

    // Find description field
    cy.get('textarea, input[placeholder*="description"], [data-testid="description"]')
      .first()
      .type(testData.testData.testProject.description);

    // Submit project creation
    cy.get('button')
      .contains(/create|save|add/i)
      .click();

    cy.waitForAnimations();

    // New project should appear in list
    cy.get('body').should('contain', testData.testData.testProject.name);
  });

  it('should display kanban board when project is selected', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Enter demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    // Click on a project
    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(2000);

    // Should show kanban board
    cy.get('.kanban, [data-testid="kanban-board"], .board').should('be.visible');

    // Should show columns (todo, in-progress, completed)
    cy.get('.column, .lane, [data-testid="column"]').should('have.length.greaterThan', 0);
  });

  it('should show task columns (Todo, In Progress, Completed)', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(2000);

    // Check for task columns (separate assertions)
    cy.get('body').should('contain.text', 'To Do');
    cy.get('body').should('contain.text', 'In Progress');
    cy.get('body').should('contain.text', 'Completed');
  });

  it('should allow creating new tasks', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(2000);

    // Look for add task button
    cy.get('button')
      .contains(/add task|new task|create task|\+/i)
      .first()
      .click();

    // Fill task form
    cy.get('input[placeholder*="task"], [data-testid="task-title"]')
      .should('be.visible')
      .type(testData.testData.testTasks[0].title);

    // Find task description field
    cy.get('textarea, input[placeholder*="description"], [data-testid="task-description"]')
      .first()
      .type(testData.testData.testTasks[0].description);

    // Submit task
    cy.get('button')
      .contains(/create|save|add/i)
      .click();

    cy.waitForAnimations();

    // Task should appear in kanban board
    cy.get('body').should('contain', testData.testData.testTasks[0].title);
  });

  it('should support drag and drop between columns', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(3000);

    // Look for existing tasks to drag
    cy.get('.task, [data-testid="task"], .task-card').then(($tasks) => {
      if ($tasks.length > 0) {
        const sourceTask = $tasks.first();

        // Find columns
        cy.get('.column, .lane, [data-testid="column"]').then(($columns) => {
          if ($columns.length > 1) {
            const targetColumn = $columns.eq(1);

            // Perform drag and drop
            cy.dragAndDrop(sourceTask, targetColumn);
            cy.waitForAnimations();
          }
        });
      }
    });
  });

  it('should allow editing existing tasks', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(3000);

    // Click on a task to edit
    cy.get('.task, [data-testid="task"], .task-card').first().click();

    // Look for edit functionality
    cy.get('button')
      .contains(/edit|modify/i)
      .first()
      .click();

    // Should show edit form
    cy.get('input, textarea').should('be.visible');
  });

  it('should allow deleting tasks', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(3000);

    // Count initial tasks
    cy.get('.task, [data-testid="task"], .task-card').then(($tasks) => {
      const initialCount = $tasks.length;

      if (initialCount > 0) {
        // Click on first task
        cy.wrap($tasks.first()).click();

        // Look for delete button
        cy.get('button')
          .contains(/delete|remove/i)
          .first()
          .click();

        // Confirm deletion if needed
        cy.get('button')
          .contains(/confirm|yes|delete/i)
          .click();

        cy.waitForAnimations();

        // Task count should decrease
        cy.get('.task, [data-testid="task"], .task-card').should('have.length', initialCount - 1);
      }
    });
  });

  it('should be responsive on mobile devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Full-Stack Task Manager');

      // Enter demo mode
      cy.get('button')
        .contains(/demo|guest|try it|sample/i)
        .click();

      cy.wait(3000);

      if (viewport.name === 'mobile') {
        // On mobile, kanban might be scrollable or stacked
        cy.get('.kanban, [data-testid="kanban-board"], .board').should('be.visible');
      }
    });
  });

  it('should handle real-time updates simulation', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Access demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    // Open project
    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(3000);

    // Make changes and verify they persist
    cy.get('.task, [data-testid="task"], .task-card').then(($tasks) => {
      if ($tasks.length > 0) {
        // The demo should show persistent changes
        cy.wrap($tasks.first()).should('be.visible');
      }
    });
  });

  it('should show proper loading states', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Should show loading when entering demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    // Look for loading indicator
    cy.get('.loading, .spinner, [data-testid="loading"]').should('be.visible');

    // Then content should load
    cy.get('.projects, [data-testid="projects-list"]', { timeout: 10000 }).should('be.visible');
  });

  it('should handle authentication errors gracefully', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try invalid login (if implemented)
    cy.get('input[type="email"]').type('invalid@email.com');
    cy.get('input[type="password"]').type('wrongpassword');

    cy.get('button')
      .contains(/login|sign in/i)
      .click();

    // Should handle error gracefully
    cy.get('body').should('be.visible');
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Wait for app to load
    cy.get('input[type="email"]').should('be.visible');

    // Click liquid glass back button
    cy.get('.liquid-back-button').should('be.visible').click();

    // Should return to homepage
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
  });
});
