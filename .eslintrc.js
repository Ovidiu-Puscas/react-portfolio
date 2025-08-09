module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'prettier/prettier': 'off', // Disable prettier rules
    'arrow-body-style': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'warn',
    'no-return-assign': 'off',
    'react/no-unescaped-entities': 'off',
  },
};
