import { cleanEnv, port, url, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URL: str(),
  WEB_URL: url({ devDefault: "http://localhost:3000" }),
  HOST: str(),
  PASS_KEY: str()
});
