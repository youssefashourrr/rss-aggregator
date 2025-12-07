import { XMLParser } from "fast-xml-parser";

import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { createPost } from "./db/queries/posts";

import type { Feed, NewPost } from "./db/schema";


export type RSSFeed = {
	channel: {
		title: string;
		link: string;
		description: string;
		item: RSSItem[];
	};
};

export type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
};

type RSSChannel = {
	title?: string;
	link?: string;
	description?: string;
	item?: RSSItem | RSSItem[];
};

type ParsedRSS = {
	rss?: {
		channel?: RSSChannel;
	};
};


export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  	const response: Response = await fetch(feedURL, {
    	headers: {
      		"User-Agent": "gator",
      		accept: "application/rss+xml",
    	},
  	});
  	if (!response.ok) {
    	throw new Error(`fetch failed: ${response.status}`);
  	}

  	const xml: string = await response.text();
  	const parser: XMLParser = new XMLParser();
  	let result: any = parser.parse(xml);

  	const channel: RSSChannel | undefined = result.rss?.channel;
  	if (!channel) {
    	throw new Error("invalid feed format");
  	}

  	if (
    	!channel ||
    	!channel.title ||
    	!channel.link ||
    	!channel.description ||
    	!channel.item
  	) {
    	throw new Error("invalid feed format");
  	}

  	const items: (RSSItem | undefined)[] = Array.isArray(channel.item) ? channel.item : [channel.item];

  	const rssItems: RSSItem[] = [];

  	for (const item of items) {
    	if (!item?.title || !item.link || !item.description || !item.pubDate) {
      		continue;
    	}

    	rssItems.push({
      		title: item.title,
      		link: item.link,
      		description: item.description,
      		pubDate: item.pubDate,
    	});
  	}

  	const rss: RSSFeed = {
    	channel: {
      		title: channel.title,
      		link: channel.link,
      		description: channel.description,
      		item: rssItems,
    	},
  	};

  	return rss;
}

export async function scrapFeeds(): Promise<void> {
	const nextFeed: Feed | null = await getNextFeedToFetch();
	if (!nextFeed) {
		console.log("no feeds to fetch");
		return;
	}

	await markFeedFetched(nextFeed.id);

	const fetchedRSS: RSSFeed = await fetchFeed(nextFeed.url);

	for (const item of fetchedRSS.channel.item) {
    	console.log(`found post: ${item.title}`);

    	const now: Date = new Date();

		await createPost({
			url: item.link,
			feedId: nextFeed.id,
			title: item.title,
			createdAt: now,
			updatedAt: now,
			description: item.description,
			publishedAt: new Date(item.pubDate),
		} satisfies NewPost);
  	}
}