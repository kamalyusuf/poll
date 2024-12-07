import { SimplePass } from "express-simple-pass";
import { env } from "./env.js";

export const simplepass = new SimplePass({
  verify: (passkey) => {
    if (!passkey) throw new Error("pass key not set");

    return passkey === env.PASS_KEY;
  },
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    signed: false,
    secure: false
  }
});
