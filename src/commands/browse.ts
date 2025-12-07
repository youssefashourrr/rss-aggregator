import { getPostsForUsers } from "../db/queries/posts";

import type { Post, User } from "../db/schema";


export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    let limit: number = 2;
    if (args.length === 1) {
        const inputLimit: number = parseInt(args[0], 10);
        if (!Number.isNaN(inputLimit)) {
            limit = inputLimit;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`);            
        }
    }

    const posts: Post[] = await getPostsForUsers(user.id, limit);

    console.log(`found ${posts.length} posts for ${user.name}:`);
    for (const post of posts) {
        console.log(`  ${post.publishedAt}`);
        console.log(`  ${post.title}`);
        console.log(`  ${post.description ?? ""}`);
        console.log(`  ${post.url}`);
        console.log();
    }
}