import { auth } from "@vestly/auth";
import { db } from "@vestly/db";
import { booklets } from "@vestly/db/schema";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: (origin) => origin,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .get("/hello", (c) => {
    return c.json({
      message: "Hello from Vestly API!",
    });
  })
  .get("/booklets", async (c) => {
    const allBooklets = await db.select().from(booklets);
    return c.json(allBooklets);
  });

export default app;
export type AppType = typeof app;
