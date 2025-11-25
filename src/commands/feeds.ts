import { readConfig } from "../config";
import { createFeed, getAllFeeds } from "../db/queries/feeds";
import { getUserById, getUserByName } from "../db/queries/users";


export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error(`Usage: ${cmdName} <name> <url>`);
    }

    const current = readConfig().currentUserName;
    const userId = (await getUserByName(current))[0].id;

    await createFeed(args[0], args[1], userId);
    console.log(`Feed added: ${args[0]}`);
}


export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const allFeeds = await getAllFeeds();
    for (const feed of allFeeds) {
        const user = await getUserById(feed.userId);
        console.log(`* ${feed.name} (${feed.url}) - ${user[0].name}`);
    }
}