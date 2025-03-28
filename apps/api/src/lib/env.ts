import { cleanEnv, port, url, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URL: str(),
  WEB_URL: url({ default: "http://localhost:3000" }),
  PASS_KEY: str({ default: undefined }),
  SECRET: str({ default: undefined })
});
