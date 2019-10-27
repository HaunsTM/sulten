import { JSDOM } from "jsdom";

export class HtmlFetcher {

    private _url: string;

    constructor(url: string) {

        this._url = url;
    }

    public async htmlFromWeb(): Promise<string> {
        const dom = await this.domFromWeb();
        const html = dom.serialize();
        return html;
    }

    private async domFromWeb(): Promise<JSDOM> {
        const dom = await JSDOM.fromURL(this._url);
        return dom;
    }

}
