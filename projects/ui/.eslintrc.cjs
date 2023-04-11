module.exports = {
  extends: ["react-app", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@emotion"],
  ignorePatterns: [
    ".eslintrc.js",
    "src/jest-puppeteer.config.js",
    "config/*",
    "jest.config.js",
    "scripts/*",
    "lint-staged.config.js",
    "cypress.config.ts",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-undef": "error",
    "prefer-const": "off",
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "off",
    "@emotion/pkg-renaming": "error",
    "react/no-unescaped-entities": "off",
    "no-extra-boolean-cast": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-namespace": "off",
    "no-console": "warn",
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],
  },
  globals: {
    JSX: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
