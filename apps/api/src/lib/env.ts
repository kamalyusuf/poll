import { cleanEnv, port, url, str } from "envalid";

export interface Env {
  PORT: number;
  REDIS_URL: string;
  MONGO_URL: string;
  NODE_ENV: "development" | "production";
  WEB_URL: string;
  SECRET_KEY: string;
  SENTRY_DSN?: string;
}

export const env = cleanEnv<Env>(process.env, {
  PORT: port(),
  REDIS_URL: url({ devDefault: "redis://localhost:6379" }),
  MONGO_URL:
    process.env.NODE_ENV === "production"
      ? url()
      : str({ devDefault: "mongodb://localhost:27017/poll" }),
  NODE_ENV: str({
    choices: ["development", "production"]
  }) as any,
  WEB_URL: url({ devDefault: "http://localhost:3000" }),
  SECRET_KEY: str(),
  SENTRY_DSN: str({ devDefault: undefined })
});

console.log(env);
