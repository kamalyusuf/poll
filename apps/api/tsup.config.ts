import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  watch: true,
  onSuccess: "node -r dotenv/config dist/index.js",
  tsconfig: "tsconfig.json"
});
