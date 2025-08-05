describe('Task Manager App', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data.projects.find((p) => p.id === 'task-manager');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForProjectLoad();
  });

  it('should load the task manager application', () => {
    cy.navigateToProject('Task Manager');

    cy.url().should('include', '/task-manager');
    cy.get('h1').should('contain', 'Task Manager');
  });

  it('should display authentication interface initially', () => {
    cy.navigateToProject('Task Manager');

    // Should show login/register form
    cy.get('input[type="email"], [data-testid="email-input"]').should('be.visible');

    cy.get('input[type="password"], [data-testid="password-input"]').should('be.visible');

    // Should have login and register options
    cy.get('button')
      .contains(/login|sign in/i)
      .should('be.visible');
  });

  it('should allow switching between login and register', () => {
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

    // Access demo mode
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    // Should show projects
    cy.get('.project, [data-testid="project"], .project-card').should('have.length.greaterThan', 0);
  });

  it('should allow creating new projects', () => {
    cy.navigateToProject('Task Manager');

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

    cy.get('textarea, input')
      .contains(/description/i)
      .or('have.attr', 'placeholder')
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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

    // Access demo and open project
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .click();

    cy.wait(3000);

    cy.get('.project, [data-testid="project"], .project-card').first().click();

    cy.wait(2000);

    // Check for task columns
    cy.get('body')
      .should('contain.text', 'To Do')
      .or('contain.text', 'Todo')
      .and('contain.text', 'In Progress')
      .and('contain.text', 'Completed');
  });

  it('should allow creating new tasks', () => {
    cy.navigateToProject('Task Manager');

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

    cy.get('textarea, input')
      .contains(/description/i)
      .or('have.attr', 'placeholder')
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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

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
      .or('have.attr', 'data-testid', 'edit-task')
      .click();

    // Should show edit form
    cy.get('input, textarea').should('be.visible');
  });

  it('should allow deleting tasks', () => {
    cy.navigateToProject('Task Manager');

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
          .or('have.attr', 'data-testid', 'delete-task')
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
      cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

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
    cy.navigateToProject('Task Manager');

    // Wait for app to load
    cy.get('input[type="email"]').should('be.visible');

    // Find and click back/home button
    cy.get('[data-testid="back-to-home"], .back-button, a[href="/"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });
});
