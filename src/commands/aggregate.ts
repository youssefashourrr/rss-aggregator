import { RSSFeed, fetchFeed } from "../rss";

  
export async function handlerAgg(_: string): Promise<void> {
  const feedURL: string = "https://www.wagslane.dev/index.xml";

  const feedData: RSSFeed = await fetchFeed(feedURL);
  const feedDataStr: string = JSON.stringify(feedData, null, 2);
  console.log(feedDataStr);
}