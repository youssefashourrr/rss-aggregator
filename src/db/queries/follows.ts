import { and, eq } from "drizzle-orm";

import { db } from "../index";
import { feed_follows, feeds, users } from "../schema";


type FeedFollowWithDetails = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    feedId: string;
    userName: string;
    feedName: string;
};


export async function createFeedFollow(userId: string, feedId: string): Promise<FeedFollowWithDetails> {
    const [newFeedFollow] = await db
		.insert(feed_follows)
		.values({ userId, feedId })
		.returning();
    
    const result: FeedFollowWithDetails[] = await db
        .select({
            id: feed_follows.id,
            createdAt: feed_follows.createdAt,
            updatedAt: feed_follows.updatedAt,
            userId: feed_follows.userId,
            feedId: feed_follows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feed_follows)
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .where(eq(feed_follows.id, newFeedFollow.id));
    
    return result[0];
}

export async function getFeedFollowsForUser(userId: string): Promise<FeedFollowWithDetails[]> {
    return await db
        .select({
            id: feed_follows.id,
            createdAt: feed_follows.createdAt,
            updatedAt: feed_follows.updatedAt,
            userId: feed_follows.userId,
            feedId: feed_follows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feed_follows)
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .where(eq(feed_follows.userId, userId));
}

export async function unfolllow(url: string, userId: string): Promise<void> {
    const feedResult: { id: string }[] = await db.select({ id: feeds.id }).from(feeds).where(eq(feeds.url, url));
    const feedId: string | undefined = feedResult[0]?.id;
    if (!feedId) {
        throw new Error("feed not found");
    }

    await db.delete(feed_follows).where(and(
        eq(feed_follows.feedId, feedId),
        eq(feed_follows.userId, userId)
    ));
}