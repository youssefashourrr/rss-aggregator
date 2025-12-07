import type { User } from "../db/schema";
import { getPostsForUsers } from "../db/queries/posts";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    let limit = 2;
    if (args.length === 1) {
        const inputLimit = parseInt(args[0]);
        if (!Number.isNaN(inputLimit)) {
            limit = inputLimit;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`);            
        }
    }

    const posts = await getPostsForUsers(user.id, limit);

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
}