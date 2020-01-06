import Parser from "rss-parser";
export interface IRSSFetcherHelper {
    feedFromWeb(): Promise<Parser.Output>;
}
