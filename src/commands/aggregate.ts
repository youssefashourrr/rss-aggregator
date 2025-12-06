import { scrapFeeds } from "../rss";


export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <delay>`);
	}

	const timeArg = args[0];
	const delay = parseDuration(timeArg);
	if (!delay) {
    	throw new Error(
			`invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`);
  	}
	console.log(`collecting feeds every ${timeArg}`);

	scrapFeeds().catch(handleError);
	const intervalId = setInterval(() => {
		scrapFeeds().catch(handleError);
	}, delay);

	return new Promise<void>((resolve) => {
		process.on("SIGINT", () => {
			clearInterval(intervalId);
			console.log("\nstopping feed aggregation...");
			resolve();
		});
	});
}

function parseDuration(durationStr: string): number {
	const regex = /^(\d+)(ms|s|m|h)$/;
	const match = durationStr.match(regex);

	if (!match) {
		throw new Error(`invalid duration format`);
	}

	const value = parseInt(match[1], 10);
	const unit = match[2];

	switch (unit) {
		case "ms":
			return value;
		case "s":
			return value * 1000;
		case "m":
			return value * 1000 * 60;
		case "h":
			return value * 1000 * 60 * 60;
		default:
			throw new Error(`unknown duration unit: ${unit}`);
	}
}

function handleError(error: unknown): void {
	console.error(`error scraping feeds: ${error instanceof Error ? error.message : String(error)}`);
}