import { JSDOM } from "jsdom";
import { JSDOM } from "pdfjs-dist";
import { IHtmlFetcherHelper } from "../interfaces/IHtmlFetcherHelper";

export class PdfFetcher {

    public actualRestaurantMenuUrl: string = "";

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
    public textContentFromHtmlDocument( htmlDocumentFromWeb: Document, xpathExpression: string ): string {
        const evaluatedHtmlDocument = this.evaluatedHtmlDocument( htmlDocumentFromWeb, xpathExpression);

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

    public async htmlDocumentFromWeb(): Promise<Document> {
        try {
            const jsDom = await JSDOM.fromURL( this.actualRestaurantMenuUrl );
            const htmlDocumentFromWeb = jsDom.window.document;

            return htmlDocumentFromWeb;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch data from ${this.actualRestaurantMenuUrl}: ${e.message}`);
        }
    }

    private evaluatedHtmlDocument( htmlDocumentFromWeb: Document, xpathExpression: string ): XPathResult {

        const FIRST_ORDERED_NODE_TYPE = 9;

        const evaluated =
        htmlDocumentFromWeb.evaluate(xpathExpression, htmlDocumentFromWeb, null, FIRST_ORDERED_NODE_TYPE, null);

        return evaluated;
    }

}
