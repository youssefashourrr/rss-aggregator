import { 
    CommandsRegistry, 
    registerCommand, 
    runCommand 
} from "src/commands/cmds";
import { handlerAgg } from "src/commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "src/commands/feeds";
import { handlerReset } from "src/commands/reset";
import { handlerLogin, handlerRegister, handlerListUsers } from "src/commands/users";
import { handlerFollow, handlerListFollows } from "src/commands/follows";


async function main() {
  	const args = process.argv.slice(2);
	if (args.length < 1) {
		console.log("usage: cli <command> [args...]");
		process.exit(1);
	}

	const cmdName = args[0];
	const cmdArgs = args.slice(1);
	const commandsRegistry: CommandsRegistry = {};

	registerCommand(commandsRegistry, "login", handlerLogin);
	registerCommand(commandsRegistry, "register", handlerRegister);
	registerCommand(commandsRegistry, "reset", handlerReset);
	registerCommand(commandsRegistry, "users", handlerListUsers);
	registerCommand(commandsRegistry, "agg", handlerAgg);
	registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
	registerCommand(commandsRegistry, "feeds", handlerListFeeds);
	registerCommand(commandsRegistry, "follow", handlerFollow);
	registerCommand(commandsRegistry, "following", handlerListFollows);
	
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