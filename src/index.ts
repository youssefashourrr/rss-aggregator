import { 
    CommandsRegistry, 
    registerCommand, 
    runCommand 
} from "./commands/cmds";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";


async function main() {
  	const args = process.argv.slice(2);
	if (args.length < 1) {
		console.log("Usage: cli <command> [args...]");
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
	
	try {
		await runCommand(commandsRegistry, cmdName, ...cmdArgs);
	} catch (err) {
		if (err instanceof Error) {
		console.error(`Error: ${err.message}`);
		} else {
		console.error(`Error: ${err}`);
		}
		process.exit(1);
	}

	process.exit(0);
}

main();