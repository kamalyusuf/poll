/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/typescript"),
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "import/no-named-as-default-member": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/no-extraneous-dependencies": "off",
    "eslint-comments/require-description": "off",
    "import/order": "off",
    curly: ["error", "multi"],
    "no-else-return": "error",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "import/no-named-as-default": "off",
    "func-names": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  overrides: [
    {
      files: ["**/*.config.ts"],
      rules: {
        "import/no-default-export": "off"
      }
    }
  ]
};
