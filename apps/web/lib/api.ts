import type { AppType } from "@vestly/api";
import { hc } from "hono/client";

const client = hc<AppType>(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
);

export const api = client;
