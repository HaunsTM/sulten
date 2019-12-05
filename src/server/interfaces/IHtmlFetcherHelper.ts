import { IWebMenuUrl } from "./IWebMenuUrl";

export interface IHtmlFetcherHelper extends IWebMenuUrl {

    textContentFromHtmlDocument(htmlDocumentFromWeb: Document, xpathExpression: string): string;

    htmlDocumentFromWeb(): Promise<Document>;

}
