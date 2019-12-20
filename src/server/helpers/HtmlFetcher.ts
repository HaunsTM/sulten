import { JSDOM } from "jsdom";
import { IHtmlFetcherHelper } from "../interfaces/IHtmlFetcherHelper";

export class HtmlFetcher implements IHtmlFetcherHelper {

    private _htmlDocumentFromWeb: Document = null;
    private _htmlDocumentFromWebShouldBeUpdated: boolean = true;
    private _actualRestaurantMenuUrl: string = "";

    get actualRestaurantMenuUrl(): string {
        return this._actualRestaurantMenuUrl;
    }
    set actualRestaurantMenuUrl(value: string) {
        this._htmlDocumentFromWebShouldBeUpdated = true;
        this._actualRestaurantMenuUrl = value;
    }

    private _initialBaseMenuUrl: string = "";

    public get initialBaseMenuUrl(): string {
        return this._initialBaseMenuUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param baseUrl - Url of the webpage
     */
    constructor(initialBaseMenuUrl: string) {
        this._initialBaseMenuUrl = initialBaseMenuUrl;
        this.actualRestaurantMenuUrl = initialBaseMenuUrl;
    }

    public async htmlDocumentFromWeb(): Promise<Document> {
        try {
            if ( this._htmlDocumentFromWeb === null || this._htmlDocumentFromWebShouldBeUpdated === true) {
                const jsDom = await JSDOM.fromURL( this.actualRestaurantMenuUrl );
                this._htmlDocumentFromWebShouldBeUpdated = false;
                this._htmlDocumentFromWeb = jsDom.window.document;
            }

            return this._htmlDocumentFromWeb;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch data from ${this.actualRestaurantMenuUrl}: ${e.message}`);
        }
    }

}
