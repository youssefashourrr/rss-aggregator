import { desc, eq } from "drizzle-orm";

import { db } from "../index";
import { feedFollows, feeds, posts } from "../schema";

import type { NewPost, Post } from "../schema";


export async function createPost(post: NewPost): Promise<Post> {
    const [result]: Post[] = await db
        .insert(posts)
        .values(post)
        .returning();
    return result;
}

export async function getPostsForUsers(userId: string, count: number): Promise<Post[]> {
	const result: Post[] = await db
		.select({
			id: posts.id,
			createdAt: posts.createdAt,
			updatedAt: posts.updatedAt,
			title: posts.title,
			url: posts.url,
			description: posts.description,
			publishedAt: posts.publishedAt,
			feedId: posts.feedId,
		})
		.from(posts)
		.innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
		.innerJoin(feeds, eq(posts.feedId, feeds.id))
		.where(eq(feedFollows.userId, userId))
		.orderBy(desc(posts.publishedAt))
		.limit(count);
	return result;
}