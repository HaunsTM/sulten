import { IWebMenuUrl } from "./IWebMenuUrl";

export interface IHtmlFetcherHelper extends IWebMenuUrl {
    htmlDocumentFromWeb(): Promise<Document>;
}
