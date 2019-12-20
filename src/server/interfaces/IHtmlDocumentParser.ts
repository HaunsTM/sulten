export interface IHtmlDocumentParser {

    contentFromHtmlDocument( xpathExpression: string): Promise<XPathResult>;
    textContentFromHtmlDocument( xpathExpression: string): Promise<string>;

}
