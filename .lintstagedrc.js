module.exports = {
  // JavaScript and JSX files
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON files
  '*.json': ['prettier --write'],

  // CSS files
  '*.css': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],
};
