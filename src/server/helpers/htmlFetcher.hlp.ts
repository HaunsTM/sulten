import { JSDOM } from "jsdom";
import { IHtmlFetcherHelper } from "../interfaces/htmlFetcherHelper.itf";

export class HtmlFetcher implements IHtmlFetcherHelper {

    private _url: string;

    /**
     * A helper class which can be used when parsing an online webpage
     * @param url - Url of the webpage
     */
    constructor(url: string) {
        this._url = url;
    }

    /**
     * Returns trimmed Node.textContent.toString of the text content of a node and its descendants.
     * @param xpathExpression - XPath which should be used to parse a HTML-dom
     */
    public textContentFromHtmlDocument( htmlDocumentFromWeb: Document, xpathExpression: string ): string {
        const evaluatedHtmlDocument = this.evaluatedHtmlDocument( htmlDocumentFromWeb, xpathExpression);

        if (!evaluatedHtmlDocument.singleNodeValue) {
            throw Error(`Couldn't find a value for xpath "${xpathExpression}" on "${this._url}".`);
        }

        try {

            const textContent = evaluatedHtmlDocument.singleNodeValue.textContent.toString().trim();

            return textContent;

        } catch ( e ) {

            throw Error(`Couldn't get textContent for xpath "${xpathExpression}" on "${this._url}".`);
        }

    }

    public get url(): string {
        return this._url;
    }

    public async htmlDocumentFromWeb(): Promise<Document> {
        try {
            const jsDom = await JSDOM.fromURL( this._url );
            const htmlDocumentFromWeb = jsDom.window.document;

            return htmlDocumentFromWeb;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch data from ${this._url}: ${e.message}`);
        }
    }

    private evaluatedHtmlDocument( htmlDocumentFromWeb: Document, xpathExpression: string ): XPathResult {

        const FIRST_ORDERED_NODE_TYPE = 9;

        const evaluated =
        htmlDocumentFromWeb.evaluate(xpathExpression, htmlDocumentFromWeb, null, FIRST_ORDERED_NODE_TYPE, null);

        return evaluated;
    }

}
