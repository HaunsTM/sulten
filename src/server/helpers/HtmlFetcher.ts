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

    /**
     * Returns trimmed Node.textContent.toString of the text content of a node and its descendants.
     * @param xpathExpression - XPath which should be used to parse a HTML-dom
     */
    public async textContentFromHtmlDocument( xpathExpression: string ): Promise<string> {
        const XPATHRESULT_FIRST_ORDERED_NODE_TYPE = 9;
        const evaluatedHtmlDocument =
            await this.evaluatedHtmlDocument( xpathExpression, XPATHRESULT_FIRST_ORDERED_NODE_TYPE);

        if (!evaluatedHtmlDocument.singleNodeValue) {
            throw Error(`Couldn't find a value for xpath "${xpathExpression}" on "${this.actualRestaurantMenuUrl}".`);
        }

        try {

            const textContent = evaluatedHtmlDocument.singleNodeValue.textContent.toString().trim();

            return textContent;

        } catch ( e ) {

            throw Error("Couldn't get textContent for xpath " +
                        `"${xpathExpression}" on "${this.actualRestaurantMenuUrl}".`);
        }
    }
    public async contentFromHtmlDocument( xpathExpression: string ): Promise<XPathResult> {

        try {
            const XPATHRESULT_ANY_TYPE = 0;
            const evaluatedHtmlDocument =
                await this.evaluatedHtmlDocument( xpathExpression, XPATHRESULT_ANY_TYPE);

            return evaluatedHtmlDocument;

        } catch ( e ) {

            throw Error("Couldn't get XPathResult for xpath " +
                        `"${xpathExpression}" on "${this.actualRestaurantMenuUrl}".`);
        }

    }

    private async evaluatedHtmlDocument( xpathExpression: string, nodeType: number ): Promise<XPathResult> {

        const htmlDocument = await this.htmlDocumentFromWeb();

        const evaluated =
            htmlDocument.evaluate(xpathExpression, htmlDocument, null, nodeType, null);

        return evaluated;
    }

    private async htmlDocumentFromWeb(): Promise<Document> {
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
