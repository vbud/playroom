module.exports = {
  '**/*.{js,md,ts,tsx}': [
    'eslint',
    "prettier --list-different '**/*.{js,md,ts,tsx}'",
    () => 'tsc --noEmit',
  ],
};
