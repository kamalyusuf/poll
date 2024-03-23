/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint-config-custom/node.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  }
}
