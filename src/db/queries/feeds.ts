import { eq } from 'drizzle-orm';

import { db } from "../index";
import { feeds, Feed } from "../schema";


export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
	const [newFeed] = await db.insert(feeds).values({ name, url, userId }).returning();
	return newFeed;
}

export async function getAllFeeds(): Promise<Feed[]> {
    return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string): Promise<Feed | null> {
	const result: Feed[] = await db.select().from(feeds).where(eq(feeds.url, url));
	return result[0] || null;
}