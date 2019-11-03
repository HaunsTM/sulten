export interface IHtmlFetcherHelper {

    url: string;

    textContentFromHtmlDocument(htmlDocumentFromWeb: Document, xpathExpression: string): string;
    htmlDocumentFromWeb(): Promise<Document>
}
