import { eq } from "drizzle-orm";

import { db } from "../index";
import { users } from "../schema";

import type { User } from "../schema";


export async function createUser(name: string): Promise<User> {
    const [result]: User[] = await db
		.insert(users)
		.values({ name })
		.returning();
    return result;
}

export async function getAllUsers(): Promise<User[]> {
    return await db
		.select()
		.from(users);
}

export async function getUserByName(name: string): Promise<User | null> {
    const result: User[] = await db
		.select()
		.from(users)
		.where(eq(users.name, name));
    return result[0] ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
    const result: User[] = await db
		.select()
		.from(users)
		.where(eq(users.id, id));
    return result[0] ?? null;
}

export async function reset(): Promise<void> {
    await db.delete(users);
}