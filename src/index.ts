import { handlerAgg } from "./commands/aggregate";
import { handlerBrowse } from "./commands/browse";
import { registerCommand, runCommand } from "./commands/cmds";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFollows, handlerUnfollow } from "./commands/follows";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

import type { CommandsRegistry } from "./commands/cmds";


async function main(): Promise<void> {
  	const args: string[] = process.argv.slice(2);
	if (args.length < 1) {
		console.log("usage: gator <command> [args]");
		process.exit(1);
	}

	const cmdName: string = args[0];
	const cmdArgs: string[] = args.slice(1);
	const commandsRegistry: CommandsRegistry = {};

	registerCommand(commandsRegistry, "login", handlerLogin);
	registerCommand(commandsRegistry, "register", handlerRegister);
	registerCommand(commandsRegistry, "reset", handlerReset);
	registerCommand(commandsRegistry, "users", handlerListUsers);
	registerCommand(commandsRegistry, "agg", handlerAgg);
	registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
	registerCommand(commandsRegistry, "feeds", handlerListFeeds);
	registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
	registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerListFollows));
	registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
	registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse));
	
	try {
		await runCommand(commandsRegistry, cmdName, ...cmdArgs);
	} catch (err) {
		if (err instanceof Error) {
		console.error(err.message);
		} else {
		console.error(String(err));
		}
		process.exit(1);
	}

	process.exit(0);
}

main();