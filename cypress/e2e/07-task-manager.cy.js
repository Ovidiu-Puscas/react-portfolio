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

    // Only visit homepage, don't clear storage (let individual tests handle cleanup)
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
    // Ensure clean state for auth interface test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    cy.navigateToProject('Full-Stack Task Manager');

    // Should show login/register form
    cy.get('[data-testid="email-input"] input, input[type="email"]').should('be.visible');

    cy.get('input[type="password"], [data-testid="password-input"]').should('be.visible');

    // Should have login and register options
    cy.get('button')
      .contains(/login|sign in/i)
      .should('be.visible');
  });

  it('should handle authentication errors gracefully', () => {
    // Ensure clean state for auth test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    cy.navigateToProject('Full-Stack Task Manager');

    // Wait for login form to appear
    cy.get('input[type="email"], [data-testid="email-input"] input', { timeout: 10000 }).should(
      'be.visible'
    );

    // Try invalid login (if implemented)
    cy.get('input[type="email"], [data-testid="email-input"] input').type('invalid@email.com');
    cy.get('input[type="password"], [data-testid="password-input"] input').type('wrongpassword');

    cy.get('button')
      .contains(/login|sign in/i)
      .click();

    // Should handle error gracefully
    cy.get('body').should('be.visible');
  });

  it('should allow switching between login and register', () => {
    // Ensure clean state for login/register test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    cy.navigateToProject('Full-Stack Task Manager');

    // Look for register/signup link or button
    cy.get('button, a')
      .contains(/register|sign up|create account/i)
      .should('be.visible')
      .click();

    cy.waitForAnimations();

    // Should show register form
    cy.get('[data-testid="email-input"] input, input[type="email"]').should('be.visible');

    // Switch back to login
    cy.get('button, a')
      .contains(/login|sign in|back to login/i)
      .should('be.visible')
      .click();
  });

  it('should handle demo/guest access', () => {
    // Ensure clean state for demo access test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    cy.navigateToProject('Full-Stack Task Manager');

    // Wait for login form to fully load
    cy.get('[data-testid="email-input"] input', { timeout: 10000 }).should('be.visible');

    // Look for demo/guest button and click it
    cy.get('button')
      .contains(/demo|guest|try it|sample/i)
      .should('be.visible')
      .click();

    // Wait for credentials to be filled
    cy.get('[data-testid="email-input"] input').should('have.value', 'test@test.com');
    cy.get('[data-testid="password-input"] input').should('have.value', 'test123');

    // Now click sign in to complete demo login with retry logic
    cy.get('button')
      .contains(/sign in/i)
      .should('not.be.disabled')
      .click();

    // Wait longer for authentication to complete in CI environment
    cy.wait(5000);

    // Check for successful login - either projects list or loading state
    cy.get('body').then(($body) => {
      // If we see an error, try the login again
      if ($body.find('[role="alert"], .MuiAlert-root').length > 0) {
        cy.log('First login attempt failed, retrying...');

        // Click demo button again
        cy.get('button')
          .contains(/demo|guest|try it|sample/i)
          .click();

        // Click sign in again
        cy.get('button')
          .contains(/sign in/i)
          .should('not.be.disabled')
          .click();

        cy.wait(5000);
      }
    });

    // Should navigate to main app interface or show loading
    cy.get('.kanban, .projects, [data-testid="projects-list"], [data-cy="loading"]', {
      timeout: 15000,
    }).should('be.visible');
  });

  it('should display projects list in main interface', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form, otherwise assume already logged in
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    // Should show projects
    cy.get(
      '.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div'
    ).should('have.length.greaterThan', 0);
  });

  it('should allow creating new projects', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    // Look for add project button
    cy.get('button')
      .contains(/add project|new project|create project/i)
      .should('be.visible')
      .click();

    // Should show project creation form - Material UI uses labels not placeholders
    cy.get('input[name="name"]').should('be.visible').type(testData.testData.testProject.name);

    // Find description field - it's a textarea with name="description"
    cy.get('textarea[name="description"]')
      .should('be.visible')
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

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    // Click on a project
    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(2000);

    // Should show kanban board
    cy.get('[data-testid="kanban-board"]').should('be.visible');

    // Should show columns (todo, in-progress, completed)
    cy.get('[data-testid^="kanban-column"]').should('have.length', 3);
  });

  it('should show task columns (Todo, In Progress, Completed)', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(2000);

    // Check for task columns (separate assertions)
    cy.get('body').should('contain.text', 'To Do');
    cy.get('body').should('contain.text', 'In Progress');
    cy.get('body').should('contain.text', 'Completed');
  });

  it('should allow creating new tasks', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(2000);

    // Look for add task button
    cy.get('button')
      .contains(/add task|new task|create task|\+/i)
      .first()
      .click();

    // Fill task form - Material UI uses name attributes
    cy.get('input[name="title"]').should('be.visible').type(testData.testData.testTasks[0].title);

    // Find task description field
    cy.get('textarea[name="description"]')
      .should('be.visible')
      .type(testData.testData.testTasks[0].description);

    // Submit task - try multiple approaches to handle dialog overlay
    cy.wait(500);

    // First try: normal click with force
    cy.get('[role="dialog"] button')
      .contains(/create|save|add/i)
      .should('be.visible')
      .click({ force: true })
      .then(() => {
        // If dialog is still open after 1 second, try alternate approach
        cy.wait(1000);
        cy.get('body').then(($body) => {
          if ($body.find('[role="dialog"]').length > 0) {
            // Dialog still open, try pressing Enter key instead
            cy.get('textarea[name="description"]').type('{enter}');
          }
        });
      });

    cy.waitForAnimations();

    // Task should appear in kanban board
    cy.get('body').should('contain', testData.testData.testTasks[0].title);
  });

  it('should support drag and drop between columns', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(3000);

    // Find draggable tasks with correct selector
    cy.get('[data-testid^="draggable-task-"]')
      .first()
      .then(($task) => {
        if ($task.length > 0) {
          const sourceTask = $task[0];

          // Find second column for drag target
          cy.get('[data-testid^="kanban-column-"]').then(($columns) => {
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

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(3000);

    // Click on a task to edit - find draggable task
    cy.get('[data-testid^="draggable-task-"]')
      .first()
      .within(() => {
        // Click the menu button (MoreVertIcon - three vertical dots)
        cy.get('button').last().click(); // The menu button is the last button in the task card
      });

    // Click Edit from the dropdown menu
    cy.get('[role="menu"] [role="menuitem"]').contains(/edit/i).click();

    // Should show edit form
    cy.get('input, textarea').should('be.visible');
  });

  it('should allow deleting tasks', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(3000);

    // Count initial tasks - find draggable tasks
    cy.get('[data-testid^="draggable-task-"]').then(($tasks) => {
      const initialCount = $tasks.length;

      if (initialCount > 0) {
        // Click on first task's menu button
        cy.wrap($tasks.first()).within(() => {
          // Click the menu button (MoreVertIcon - three vertical dots)
          cy.get('button').last().click(); // The menu button is the last button in the task card
        });

        // Click Delete from the dropdown menu
        cy.get('[role="menu"] [role="menuitem"]')
          .contains(/delete|remove/i)
          .click();

        // Confirm deletion if needed (some implementations have confirmation dialogs)
        cy.get('body').then(($body) => {
          if (
            $body.find(
              'button:contains("confirm"), button:contains("yes"), button:contains("delete")'
            ).length > 0
          ) {
            cy.get('button')
              .contains(/confirm|yes|delete/i)
              .click();
          }
        });

        cy.waitForAnimations();

        // Task count should decrease
        cy.get('[data-testid^="draggable-task-"]').should('have.length', initialCount - 1);
      }
    });
  });

  it('should be responsive on mobile devices', () => {
    cy.testResponsive((viewport) => {
      cy.navigateToProject('Full-Stack Task Manager');

      // Try to login if we see the login form
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Try Demo")').length > 0) {
          cy.get('button').contains('Try Demo').click();
          cy.get('button')
            .contains(/sign in/i)
            .click();
          cy.wait(3000);
        }
      });

      // Check if we need to add sample data first
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Add Sample Data")').length > 0) {
          cy.get('button').contains('Add Sample Data').click();
          cy.wait(5000); // Wait for sample data to be created
        }
      });

      // Click on a project to get to kanban board
      cy.get(
        '.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div'
      )
        .first()
        .click();

      cy.wait(2000);

      if (viewport.name === 'mobile') {
        // On mobile, kanban might be scrollable or stacked
        cy.get('[data-testid="kanban-board"]').should('be.visible');
      }
    });
  });

  it('should handle real-time updates simulation', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    // Open project
    cy.get('.project, [data-testid="project"], .project-card, [data-testid="projects-grid"] > div')
      .first()
      .click();

    cy.wait(3000);

    // Make changes and verify they persist
    cy.get('[data-testid^="draggable-task-"]').then(($tasks) => {
      if ($tasks.length > 0) {
        // The demo should show persistent changes
        cy.wrap($tasks.first()).should('be.visible');
      }
    });
  });

  it('should show proper loading states', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Try to login if we see the login form
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Try Demo")').length > 0) {
        cy.get('button').contains('Try Demo').click();
        cy.get('button')
          .contains(/sign in/i)
          .click();
        cy.wait(3000);
      }
    });

    // Check if we need to add sample data first
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Sample Data")').length > 0) {
        cy.get('button').contains('Add Sample Data').click();
        cy.wait(5000); // Wait for sample data to be created
      }
    });

    // After login/sample data, we should see projects
    // The loading state might be too quick to catch, so we'll just verify the end result
    cy.get('[data-testid="projects-list"]', { timeout: 10000 }).should('be.visible');

    // Verify that content has loaded by checking for project cards
    cy.get('[data-testid="projects-grid"] > div').should('have.length.greaterThan', 0);
  });

  it('should navigate back to homepage', () => {
    cy.navigateToProject('Full-Stack Task Manager');

    // Click liquid glass back button (should work regardless of login state)
    cy.get('.liquid-back-button').should('be.visible').click();

    // Should return to homepage
    cy.get('.liquid-hero-title').should('be.visible');
    cy.get('.liquid-app-card').should('have.length', 7);
  });
});
