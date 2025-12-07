import { and, eq } from "drizzle-orm";

import { db } from "../index";
import { feedFollows, feeds, users } from "../schema";

import type { FeedFollow } from "../schema";


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
    const [newFeedFollow]: FeedFollow[] = await db
		.insert(feedFollows)
		.values({ userId, feedId })
		.returning();
    
    const result: FeedFollowWithDetails[] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFeedFollow.id));
    
    return result[0];
}

export async function getFeedFollowsForUser(userId: string): Promise<FeedFollowWithDetails[]> {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId));
}

export async function unfolllow(url: string, userId: string): Promise<void> {
    const feedResult: { id: string }[] = await db
        .select({ id: feeds.id })
        .from(feeds)
        .where(eq(feeds.url, url));

    const feedId: string | undefined = feedResult[0]?.id;
    if (!feedId) {
        throw new Error(`feed not found: ${url}`);
    }

    await db
        .delete(feedFollows)
        .where(and(
        eq(feedFollows.feedId, feedId),
        eq(feedFollows.userId, userId)
    ));
}