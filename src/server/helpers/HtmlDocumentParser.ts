import { IHtmlDocumentParser } from "../interfaces/IHtmlDocumentParser";

export class HtmlDocumentParser implements IHtmlDocumentParser {
    private htmlDocument: Document = null;

    constructor( htmlDocument: Document ) {
        this.htmlDocument = htmlDocument;
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
            throw Error(`Couldn't find a value for xpath "${xpathExpression}".`);
        }

        try {

            const textContent = evaluatedHtmlDocument.singleNodeValue.textContent.toString().trim();

            return textContent;

        } catch ( e ) {
            throw Error(`Couldn't get XPathResult for xpath ${xpathExpression}.`);
        }
    }
    public async contentFromHtmlDocument( xpathExpression: string ): Promise<XPathResult> {

        try {
            const XPATHRESULT_ANY_TYPE = 0;
            const evaluatedHtmlDocument =
                await this.evaluatedHtmlDocument( xpathExpression, XPATHRESULT_ANY_TYPE);

            return evaluatedHtmlDocument;

        } catch ( e ) {
            throw Error(`Couldn't get XPathResult for xpath ${xpathExpression}.`);
        }

    }

    private async evaluatedHtmlDocument( xpathExpression: string, nodeType: number ): Promise<XPathResult> {

        const tempHtmlDocument = this.htmlDocument;

        const evaluated =
            tempHtmlDocument.evaluate(xpathExpression, tempHtmlDocument, null, nodeType, null);

        return evaluated;
    }

}
