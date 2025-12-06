import { createFeedFollow, getFeedFollowsForUser, unfolllow } from "../db/queries/follows";
import { getFeedByUrl } from "../db/queries/feeds";
import { User, Feed } from "../db/schema";


export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url: string = args[0];
    const feed: Feed | null = await getFeedByUrl(url);
    if (!feed) {
        throw new Error("feed not found");
    }

    await createFeedFollow(user.id, feed.id);
    console.log(`following: ${feed.name}`);
}

export async function handlerListFollows(_: string, user: User): Promise<void> {
    const feedFollows = await getFeedFollowsForUser(user.id);

    for (const follow of feedFollows) {
        console.log(`* ${follow.feedName}`)
    }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url: string = args[0];
    await unfolllow(url, user.id);
    console.log(`unfollowed: ${url}`);
}