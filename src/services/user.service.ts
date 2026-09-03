// services/user.service.ts
import { db } from "../db/database.ts";
import { usersTable } from "../db/schema/auth.schema.ts";
import { eq } from "drizzle-orm";

export async function getUserByGuid(guid: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.guid, guid));

  return user || null;
}
