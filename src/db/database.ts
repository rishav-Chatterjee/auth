import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config/config.ts";
import * as schema from "./schema/schema.ts";

const queryClient = postgres(config.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle({ client: queryClient, schema });

export async function connectDB() {
  await queryClient`SELECT 1`;
  console.log("Database connected successfully");
}
