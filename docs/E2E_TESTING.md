# End-to-End Testing with Cypress

This document outlines the comprehensive E2E testing setup for the React Portfolio application using Cypress.

## Overview

Our E2E testing strategy covers all 7 portfolio projects with comprehensive test scenarios including:

- **Homepage navigation and functionality**
- **Individual project interactions**
- **Responsive design testing**
- **Accessibility validation**
- **Performance monitoring**
- **Error handling**

## Test Structure

### Test Files

```
cypress/
├── e2e/
│   ├── 00-homepage.cy.js           # Homepage and navigation tests
│   ├── 01-e-signature-app.cy.js    # E-Signature app functionality
│   ├── 02-complementary-colors.cy.js # Color theory app tests
│   ├── 03-like-photo-app.cy.js     # Photo gallery interactions
│   ├── 04-tax-calculator.cy.js     # Tax calculation features
│   ├── 05-road-builder-puzzle.cy.js # Puzzle game mechanics
│   ├── 06-threejs-painting.cy.js   # 3D painting interactions
│   └── 07-task-manager.cy.js       # Full-stack task management
├── fixtures/
│   └── testData.json               # Test data and configuration
└── support/
    ├── commands.js                 # Custom Cypress commands
    └── e2e.js                      # Global configuration
```

## Test Categories

### 1. Homepage Tests (`00-homepage.cy.js`)

- **Navigation**: Project card navigation and routing
- **SEO**: Meta tags, title, and social sharing
- **Responsive Design**: Mobile, tablet, and desktop layouts
- **Performance**: Load time and resource optimization
- **Accessibility**: ARIA labels, keyboard navigation
- **Error Boundaries**: Graceful error handling

### 2. Project-Specific Tests

Each project has comprehensive test coverage for:

#### E-Signature App

- Form input validation and interaction
- Canvas signature drawing functionality
- PDF generation and preview
- Responsive layout adaptation

#### Complementary Colors App

- Color wheel interaction and selection
- Complementary color calculation accuracy
- Color harmony display (analogous, triadic)
- Real-time color value updates

#### Like My Photo App

- Photo grid layout and masonry
- Double-click like functionality
- Heart animation effects
- Like counter updates

#### Tax Calculator App

- Income input and currency selection
- Real-time exchange rate integration
- Tax calculation accuracy
- Multi-currency support

#### Road Builder Puzzle

- Puzzle tile movement mechanics
- Game state management (moves, timer)
- Connection validation algorithms
- Reset and shuffle functionality

#### 3D Painting App

- Three.js canvas initialization
- Brush tool interactions
- Color palette selection
- Camera rotation controls
- Performance with multiple strokes

#### Task Manager App

- Authentication flow (demo mode)
- Project CRUD operations
- Kanban board drag-and-drop
- Real-time updates simulation

## Custom Commands

### Navigation Commands

```javascript
cy.navigateToProject(projectName); // Navigate to specific project
cy.waitForProjectLoad(); // Wait for project to fully load
```

### Interaction Commands

```javascript
cy.interactWithCanvas(selector, x, y); // 3D canvas interactions
cy.dragAndDrop(source, target); // Drag-and-drop operations
cy.testResponsive(callback); // Multi-viewport testing
```

### Utility Commands

```javascript
cy.setViewport(preset); // Quick viewport switching
cy.waitForAnimations(); // Animation completion
cy.screenshotWithTimestamp(name); // Timestamped screenshots
```

## Test Data Management

Test data is centralized in `fixtures/testData.json`:

```json
{
  "projects": [
    {
      "id": "e-signature",
      "testData": {
        "signerName": "John Doe",
        "documentTitle": "Test Agreement"
      }
    }
  ],
  "ui": {
    "timeouts": { "default": 10000 },
    "selectors": { "projectCard": "[data-testid='project-card']" }
  }
}
```

## Running Tests

### Local Development

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run all tests headlessly
npm run cypress:run

# Run with specific browser
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:electron

# Full E2E test suite
npm run e2e
npm run e2e:headless
```

### CI/CD Pipeline

Tests run automatically on:

- **Pull Requests**: All E2E tests
- **Push to develop**: Staging deployment after E2E pass
- **Push to main**: Production deployment after E2E pass

## Browser Support

Tests run on multiple browsers:

- **Chrome** (primary)
- **Firefox**
- **Edge** (via GitHub Actions)

## Mobile Testing

Dedicated mobile test scenarios with:

- Touch interactions
- Responsive breakpoints
- Performance on mobile viewports

## Performance Integration

E2E tests include performance monitoring:

- Load time thresholds
- Lighthouse CI integration
- Resource optimization validation

## Error Handling

Comprehensive error handling for:

- Network failures
- API timeouts
- WebGL context issues
- React error boundaries

## Best Practices

### 1. Test Isolation

- Each test is independent
- Clean state between tests
- No shared test data

### 2. Reliable Selectors

- Prefer `data-testid` attributes
- Fallback to semantic selectors
- Avoid brittle CSS selectors

### 3. Wait Strategies

- Explicit waits for elements
- Network request completion
- Animation and transition completion

### 4. Debugging

- Screenshots on failure
- Video recordings
- Console log capture

## Configuration

### Cypress Config (`cypress.config.js`)

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    retries: { runMode: 2, openMode: 0 }
  }
}
```

### Environment Variables

```bash
CYPRESS_baseUrl=http://localhost:3000
REACT_APP_TEST_MODE=true
```

## Continuous Integration

### GitHub Actions Integration

- Parallel test execution
- Cross-browser testing
- Mobile viewport testing
- Accessibility validation
- Performance monitoring

### Artifacts Collection

- Screenshots on test failure
- Video recordings of test runs
- Lighthouse performance reports
- Coverage reports

## Accessibility Testing

E2E tests include accessibility validation:

- Screen reader compatibility
- Keyboard navigation
- Color contrast verification
- ARIA attribute validation

## Monitoring and Reporting

- **Test Results**: GitHub Actions reporting
- **Performance Metrics**: Lighthouse CI
- **Error Tracking**: Screenshot and video artifacts
- **Coverage Reports**: Combined with unit tests

## Troubleshooting

### Common Issues

1. **Timeouts**: Increase wait times for slow loading projects
2. **Flaky Tests**: Add proper wait conditions
3. **Canvas Issues**: Ensure WebGL context is available
4. **Firebase Auth**: Use demo mode for consistent testing

### Debug Commands

```bash
# Run with debug output
DEBUG=cypress:* npm run cypress:run

# Open specific test file
npx cypress open --config specPattern=cypress/e2e/01-*.cy.js
```

This comprehensive E2E testing setup ensures that all portfolio projects function correctly across different browsers, devices, and user scenarios, providing confidence in deployments and user experience quality.
