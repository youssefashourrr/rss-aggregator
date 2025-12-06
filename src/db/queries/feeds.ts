import { eq, sql } from 'drizzle-orm';

import { db } from "../index";
import { feeds, Feed } from "../schema";


export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
	const [newFeed] = await db
		.insert(feeds)
		.values({ name, url, userId })
		.returning();
	return newFeed;
}

export async function getAllFeeds(): Promise<Feed[]> {
    return await db
		.select()
		.from(feeds);
}

export async function getFeedByUrl(url: string): Promise<Feed | null> {
	const result: Feed[] = await db
		.select()
		.from(feeds)
		.where(eq(feeds.url, url));
	return result[0] || null;
}

export async function markFeedFetched(id: string): Promise<void> {
	await db
		.update(feeds)
		.set({ updatedAt: new Date(), lastFetchedAt: new Date() })
		.where(eq(feeds.id, id));
}

export async function getNextFeedToFetch(): Promise<Feed | null> {
	const result: Feed[] = await db.execute(sql`
		SELECT *
		FROM feeds
		ORDER BY last_fetched_at NULLS FIRST`)
	return result[0] || null;
}