import { readConfig } from "src/config";
import { createFeed, getAllFeeds } from "src/db/queries/feeds";
import { createFeedFollow } from "src/db/queries/follows";
import { getUserById, getUserByName } from "src/db/queries/users";


export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const current = readConfig().currentUserName;
    const user = (await getUserByName(current))[0];

    const newFeed = await createFeed(args[0], args[1], user.id);
    await createFeedFollow(user.id, newFeed.id);
    console.log(`feed added: ${newFeed.name}`);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const allFeeds = await getAllFeeds();
    for (const feed of allFeeds) {
        const user = await getUserById(feed.userId);
        console.log(`* ${feed.name} (${feed.url}) - ${user[0].name}`);
    }
}