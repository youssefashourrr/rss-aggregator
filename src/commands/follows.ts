import { createFeedFollow, getFeedFollowsForUser } from "src/db/queries/follows";
import { getFeedByUrl } from "src/db/queries/feeds";
import { getUserByName } from "src/db/queries/users";
import { readConfig } from "src/config";


export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];
    const current = readConfig().currentUserName;

    const user = (await getUserByName(current))[0];
    const feed = (await getFeedByUrl(url))[0];

    const newFeedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`following ${feed.name}`);
}

export async function handlerListFollows(cmdName: string, ...args: string[]): Promise<void> {
    const current = readConfig().currentUserName;

    const user = (await getUserByName(current))[0];
    const feedFollows = await getFeedFollowsForUser(user.id);

    for (const follow of feedFollows) {
        console.log(`* ${follow.feedName}`)
    }
}