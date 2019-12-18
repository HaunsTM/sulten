import { IWebMenuUrl } from "./IWebMenuUrl";

export interface IHtmlFetcherHelper extends IWebMenuUrl {

    contentFromHtmlDocument( xpathExpression: string): Promise<XPathResult>;
    textContentFromHtmlDocument( xpathExpression: string): Promise<string>;

}
