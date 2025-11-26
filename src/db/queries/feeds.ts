import { eq } from 'drizzle-orm';

import { db } from "src/db/index";
import { feeds, users } from "src/db/schema";


export async function createFeed(name: string, url: string, userId: string) {
	const [newFeed] = await db.insert(feeds).values({ name, url, userId }).returning();
	return newFeed;
}

export async function getAllFeeds() {
    return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
	return await db.select().from(feeds).where(eq(feeds.url, url));
}