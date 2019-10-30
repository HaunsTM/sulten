export interface IHtmlFetcherHelper {

    textContentFromHtmlDocument(xpathExpression: string): Promise<string>;

}
