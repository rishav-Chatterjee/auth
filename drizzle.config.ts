import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import config from "./src/config/config.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/auth.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
