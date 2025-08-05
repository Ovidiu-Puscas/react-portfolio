module.exports = {
  // JavaScript and JSX files
  '*.{js,jsx}': ['eslint --fix', 'prettier --write', 'git add'],

  // JSON files
  '*.json': ['prettier --write', 'git add'],

  // CSS files
  '*.css': ['prettier --write', 'git add'],

  // Markdown files
  '*.md': ['prettier --write', 'git add'],

  // Run tests on affected JavaScript/JSX files
  '**/*.{js,jsx}': (filenames) => {
    // Only run tests if test files exist
    const testCommand =
      filenames.length > 0
        ? `npm test -- --findRelatedTests ${filenames.join(' ')} --passWithNoTests`
        : 'npm test -- --passWithNoTests';
    return [testCommand];
  },
};
