export interface IHtmlFetcherHelper {

    url: string;

    textContentFromHtmlDocument(xpathExpression: string): Promise<string>;
}
