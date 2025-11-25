import { db } from "..";
import { feeds, users } from "../schema";


export async function createFeed(name: string, url: string, userId: string) {
	const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
	return result;
}


export async function getAllFeeds() {
    return await db.select({ name: feeds.name, url: feeds.url, userId: feeds.user_id }).from(feeds);
}