import "server-only";
import { neon } from "@neondatabase/serverless";
import { NeonHTTPAdapter } from "@lucia-auth/adapter-postgresql";

const sql = neon(process.env.DATABASE_URL as string);

export const adapter = new NeonHTTPAdapter(sql, {
  user: "users",
  session: "sessions",
});

export default sql;
