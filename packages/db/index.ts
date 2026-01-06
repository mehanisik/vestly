import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  accounts,
  booklets,
  sessions,
  transactions,
  users,
  verifications,
} from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    accounts,
    booklets,
    sessions,
    transactions,
    users,
    verifications,
  },
});

export { pool };
