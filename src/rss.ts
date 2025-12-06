import { XMLParser } from "fast-xml-parser";

import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import type { Feed } from "./db/schema";


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


export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  	const response = await fetch(feedURL, {
    	headers: {
      		"User-Agent": "gator",
      		accept: "application/rss+xml",
    	},
  	});
  	if (!response.ok) {
    	throw new Error(`failed to fetch feed: ${response.status}`);
  	}

  	const xml: string = await response.text();
  	const parser: XMLParser = new XMLParser();
  	let result: any = parser.parse(xml);

  	const channel: any = result.rss?.channel;
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

  	const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

  	const rssItems: RSSItem[] = [];

  	for (const item of items) {
    	if (!item.title || !item.link || !item.description || !item.pubDate) {
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
		console.error("no feeds available to fetch");
		return;
	}

	await markFeedFetched(nextFeed.id);

	const fetchedRSS: RSSFeed = await fetchFeed(nextFeed.url);

	for (const item of fetchedRSS.channel.item) {
		console.log(`* ${item.title}`);
	}
}