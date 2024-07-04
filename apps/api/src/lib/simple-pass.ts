import { SimplePass } from "express-simple-pass";
import { env } from "./env.js";

export const simplepass = new SimplePass({
  verify: (passkey) => passkey === env.PASS_KEY,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    signed: false,
    secure: false
  }
});
