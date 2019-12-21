export interface IHtmlDocumentParser {
    htmlDocument: Document;
    contentFromHtmlDocument( xpathExpression: string): Promise<XPathResult>;
    textContentFromHtmlDocument( xpathExpression: string): Promise<string>;

}
