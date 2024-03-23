const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("@vercel/style-guide/eslint/node"), "./preset.js"],
  parserOptions: {
    project
  },
  env: {
    node: true,
    es6: true
  },
  plugins: [],
  settings: {
    "import/resolver": {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: ["node_modules/", "dist/", ".*.js"],
  rules: {}
};
