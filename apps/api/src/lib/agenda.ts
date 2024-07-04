import { Agenda } from "agenda";
import { env } from "./env.js";
import { consola } from "consola";

export const agenda = new Agenda({
  db: {
    address: env.MONGO_URL,
    collection: "agenda_jobs"
  }
});

agenda.on("ready", () => {
  consola.info("agenda ready");
});

agenda.on("error", (error: Error) => {
  consola.error(`agenda initialization failed. reason: ${error.message}`);

  process.exit(1);
});
