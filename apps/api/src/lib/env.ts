import { cleanEnv, port, url, str } from "envalid";

export interface Env {
  PORT: number;
  REDIS_URL: string;
  MONGO_URL: string;
  NODE_ENV: "development" | "production";
  WEB_URL: string;
}

export const env = cleanEnv<Env>(process.env, {
  PORT: port(),
  REDIS_URL: process.env.NODE_ENV === "test" ? str() : url(),
  MONGO_URL: process.env.NODE_ENV === "production" ? url() : str(),
  NODE_ENV: str({
    choices: ["development", "production"]
  }) as any,
  WEB_URL: url()
});
