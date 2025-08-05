# Cypress E2E Testing

This directory contains end-to-end tests for the React Portfolio application using Cypress.

## Test Structure

- `e2e/` - Test specifications
- `fixtures/` - Test data
- `support/` - Helper commands and configuration
- `videos/` - Test recordings (gitignored)
- `screenshots/` - Failure screenshots (gitignored)

## Running Tests

```bash
# Run all tests headlessly
npm run cypress:run

# Open Cypress Test Runner
npm run cypress:open

# Run specific test
npx cypress run --spec cypress/e2e/00-homepage.cy.js
```

## Test Coverage

- ✅ Homepage navigation and UI components
- ✅ E-Signature app functionality
- ✅ Color harmony generator
- ✅ Photo gallery interactions
- ✅ Tax calculator features
- ✅ Road builder puzzle game
- ✅ Three.js 3D painting app
- ✅ Task manager full-stack features

## Video Recording

Videos are automatically recorded during test runs but are:

- Compressed for smaller file size
- Only kept for failed tests (saves storage)
- Excluded from git commits
- Useful for debugging and demonstrations

## Configuration

The tests are configured to:

- Handle Firebase authentication errors gracefully
- Support responsive design testing
- Include accessibility checks
- Mock external API calls when needed
