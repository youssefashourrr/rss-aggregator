import { eq } from "drizzle-orm";

import { db } from "src/db/index";
import { feed_follows, feeds, users } from "src/db/schema";


export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feed_follows).values({userId, feedId}).returning();
    
    const result = await db
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

export async function getFeedFollowsForUser(userId: string) {
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