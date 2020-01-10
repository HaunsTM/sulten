import { JSDOM } from "jsdom";
import { IHtmlFetcherHelper } from "../interfaces/IHtmlFetcherHelper";

export class HtmlFetcher implements IHtmlFetcherHelper {

    private _htmlDocumentFromWeb: Document = null;
    private _menuUrl: string = "";

    private _baseUrl: string = "";

    public get baseUrl(): string {
        return this._baseUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param baseUrl - Url of the webpage
     */
    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public async htmlDocumentFromWeb(): Promise<Document> {
        try {
            if ( this._htmlDocumentFromWeb === null ) {
                const jsDom = await JSDOM.fromURL( this.baseUrl );
                this._htmlDocumentFromWeb = jsDom.window.document;
            }

            return this._htmlDocumentFromWeb;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch data from ${this.baseUrl}: ${e.message}`);
        }
    }

}
