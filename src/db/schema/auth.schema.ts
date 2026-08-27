import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers/sql.ts";
import { v4 as uuidv4 } from "uuid";

uuidv4();

export const usersTable = pgTable("users", {
  guid: varchar({ length: 255 }).primaryKey().$default(uuidv4),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
