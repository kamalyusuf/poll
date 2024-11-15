declare module "agendash" {
  import type { Agenda } from "agenda";
  import type { RequestHandler } from "express";

  export default function agendash(agenda: Agenda): RequestHandler;
}
