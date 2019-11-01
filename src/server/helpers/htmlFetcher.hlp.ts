import { JSDOM } from "jsdom";
import { IHtmlFetcherHelper } from "../interfaces/htmlFetcherHelper.itf";

export class HtmlFetcher implements IHtmlFetcherHelper {

    private _url: string;
    private _document: Document = null;

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
    public async textContentFromHtmlDocument(xpathExpression: string): Promise<string> {
        const evaluatedHtmlDocument = await this.evaluatedHtmlDocument(xpathExpression);
        const textContent = evaluatedHtmlDocument.singleNodeValue.textContent.toString().trim();

        return textContent;
    }

    public get url(): string {
        return this._url;
    }

    private async evaluatedHtmlDocument(xpathExpression: string): Promise<XPathResult> {

        const FIRST_ORDERED_NODE_TYPE = 9;
        const jsDomFromWeb = await this.htmlDocumentFromWeb();

        const evaluated =
            jsDomFromWeb.evaluate(xpathExpression, jsDomFromWeb, null, FIRST_ORDERED_NODE_TYPE, null);

        return evaluated;
    }

    private async htmlDocumentFromWeb(): Promise<Document> {
        if ( !this._document ) {
            const jsDom = await JSDOM.fromURL(this._url);
            this._document = jsDom.window.document;
            return this._document;
        }
        return this._document;
    }

}
