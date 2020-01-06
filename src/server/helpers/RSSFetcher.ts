import Parser from "rss-parser";
import { IRSSFetcherHelper } from "../interfaces/IRSSFetcherHelper";

export class RSSFetcher implements IRSSFetcherHelper {

    private _feed: Parser.Output = null;

    private _baseUrl: string = "";

    public get baseUrl(): string {
        return this._baseUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param baseUrl - Url of the RSS-feed
     */
    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public async feedFromWeb(): Promise<Parser.Output> {
        try {
            if ( this._feed === null ) {
                const parser = new Parser();
                const feed = await parser.parseURL( this.baseUrl );
                this._feed = feed;
            }

            return this._feed;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch RSS from ${this.baseUrl}: ${e.message}`);
        }
    }

}
