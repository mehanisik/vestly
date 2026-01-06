import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function reset() {
  const client = await pool.connect();
  try {
    console.log("Dropping tables...");
    await client.query(`
      DROP TABLE IF EXISTS "transaction" CASCADE;
      DROP TABLE IF EXISTS "booklet" CASCADE;
      DROP TABLE IF EXISTS "user" CASCADE;
      DROP TABLE IF EXISTS "session" CASCADE;
      DROP TABLE IF EXISTS "account" CASCADE;
      DROP TABLE IF EXISTS "verification" CASCADE;
      DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;
    `);
    console.log("Success! Tables dropped.");
  } catch (err) {
    console.error("Error dropping tables:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
