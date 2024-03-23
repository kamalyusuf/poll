import mongoose, { Types, Document } from "mongoose";
import { env } from "../lib/env";
import { consola } from "consola";
import { type Express } from "express";
import { type Server } from "node:http";

export const timeisafter = (time: Date, additional = 300000) => {
  const min = new Date().getTime() + additional;
  const difference = min - time.getTime();

  return Math.sign(difference) === 1;
};

export const isobjectid = (str: string) => Types.ObjectId.isValid(str);

export const objectid = (str: string) => {
  if (!isobjectid(str)) throw new Error("invalid id");

  return new Types.ObjectId(str);
};

export const isisodate = (date: string) =>
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date);

export const ismongoosedoc = (doc: object) => doc instanceof Document;

export const host = (t: "web" | "api") => {
  const protocol = env.isProduction ? "https" : "http";

  const web = t === "web";

  if (web) return env.WEB_URL;

  return `${protocol}://${env.HOST}${env.isProd ? "" : `:${env.PORT}`}`;
};

export const absoluteuri = (t: "web" | "api", path: `/${string}`) => {
  if (t === "web") return `${host("web")}${path}`;

  return `${host("api")}${path}`;
};

export const usetransaction = async (
  fn: Parameters<mongoose.ClientSession["withTransaction"]>[0]
) => {
  const session = await mongoose.startSession();

  await session.withTransaction(fn);
};

export const start = ({ app, port }: { app: Express; port: number }) =>
  new Promise<Server>((resolve, reject) => {
    const server = app.listen(port);

    server.on("listening", () => {
      consola.info(`api on http://localhost:${port}`);

      resolve(server);
    });

    server.on("error", reject);
  });

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const aspromise = <T>(arg: T | (() => T)) =>
  new Promise<T>((resolve, reject) => {
    try {
      resolve(typeof arg === "function" ? (arg as () => T)() : arg);
    } catch (e) {
      reject(e as Error);
    }
  });

export const saferun = (fn: () => void | Promise<void>) => {
  aspromise(fn()).then(noop).catch(noop);
};
