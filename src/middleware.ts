import type { CommandHandler, UserCommandHandler } from "./commands/cmds";
import { readConfig } from "./config";
import { getUserByName } from "./db/queries/users";
import type { User } from "./db/schema";


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const config = readConfig();
        const userName: string | undefined = config.currentUserName;
        if (!userName) {
            throw new Error("user not logged in");
        }

        const user: User | null = await getUserByName(userName);
        if (!user) {
            throw new Error(`user '${userName}' not found`);
        }

        await handler(cmdName, user, ...args);
  };
}
