import { eq } from 'drizzle-orm';

import { db } from "src/db/index";
import { users } from "src/db/schema";


export async function createUser(name: string) {
    const [newUser] = await db.insert(users).values({ name }).returning();
    return newUser;
}

export async function getAllUsers() {
    return await db.select().from(users);
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