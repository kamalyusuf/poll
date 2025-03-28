import { SimplePass } from "express-simple-pass";
import { env } from "./env.js";

export const simplepass = new SimplePass({
  type: "passkey",
  verify: (passkey) => passkey === env.PASS_KEY,
  cookie: {
    secret: env.SECRET ?? "secret",
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
});
