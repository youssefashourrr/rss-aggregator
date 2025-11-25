import { eq, gte, lt, ne } from 'drizzle-orm';

import { db } from "..";
import { users } from "../schema";


export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getAllUsers() {
    return await db.select({ name: users.name }).from(users);
}

export async function getUserByName(name: string) {
    return await db.select().from(users).where(eq(users.name, name));
}

export async function getUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id));
}

export async function reset() {
    await db.delete(users);
}