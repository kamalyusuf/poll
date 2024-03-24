/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint-config-custom/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname
  }
};
