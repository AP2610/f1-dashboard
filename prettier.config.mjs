const prettierConfig = {
  printWidth: 130,
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSameLine: false,
  jsxSingleQuote: false,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/globals.css',
};

export default prettierConfig;