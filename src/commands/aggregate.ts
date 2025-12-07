import { scrapFeeds } from "../rss";


export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <delay>`);
	}

	const timeArg: string = args[0];
	const delay: number = parseDuration(timeArg);
	if (!delay) {
    	throw new Error(`invalid duration: ${timeArg}`);
  	}
	console.log(`collecting feeds every ${timeArg}`);

	scrapFeeds().catch(handleError);
	const intervalId: NodeJS.Timeout = setInterval(() => {
		scrapFeeds().catch(handleError);
	}, delay);

	return new Promise<void>((resolve: () => void) => {
		process.on("SIGINT", () => {
			clearInterval(intervalId);
			console.log("\nstopping aggregation");
			resolve();
		});
	});
}

function parseDuration(durationStr: string): number {
	const regex: RegExp = /^(\d+)(ms|s|m|h)$/;
	const match: RegExpMatchArray | null = durationStr.match(regex);

	if (!match) {
		throw new Error("invalid duration format");
	}

	const value: number = parseInt(match[1], 10);
	const unit: string = match[2];

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
			throw new Error(`unknown unit: ${unit}`);
	}
}

function handleError(error: unknown): void {
	console.error(`scrape error: ${error instanceof Error ? error.message : String(error)}`);
}