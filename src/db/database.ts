import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config/config.ts";

type DrizzleClient = ReturnType<typeof drizzle>;

const queryClient = postgres(config.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db: DrizzleClient = drizzle({ client: queryClient });

export async function connectDB(): Promise<void> {
  await queryClient`SELECT 1`;
  console.log("Database connected successfully");
}

export type { DrizzleClient };
