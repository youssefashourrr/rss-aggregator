import type { User, Feed } from "src/db/schema";
import { createFeed, getAllFeeds } from "../db/queries/feeds";
import { createFeedFollow } from "../db/queries/follows";
import { getUserById } from "../db/queries/users";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const name: string = args[0];
    const url: string = args[1];
    const newFeed: Feed = await createFeed(name, url, user.id);
    
    await createFeedFollow(user.id, newFeed.id);
    console.log(`feed created: ${newFeed.name}`);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const allFeeds: Feed[] = await getAllFeeds();
    for (const feed of allFeeds) {
        const user: User | null = await getUserById(feed.userId);
        if (user) {
            console.log(`* ${feed.name} (${feed.url}) - ${user.name}`);
        }
    }
}