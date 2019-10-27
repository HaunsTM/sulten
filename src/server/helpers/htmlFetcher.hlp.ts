import { JSDOM } from "jsdom";

export class HtmlFetcher {

    private _url: string;

    constructor(url: string) {

        this._url = url;
    }

    public async htmlFromWeb(): Promise<string> {


        const dom = await this.domFromWeb();
        const document = dom.window.document;

        var xpath = "//*[@id='dagens']/div[2]/div[1]/div[1]/div/table/tbody/tr[2]/td[1]/p/span";
        var evaluator = new XPathEvaluator();
        var expression = evaluator.createExpression(xpath);
        var result = expression.evaluate(document, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

        const html = dom.serialize();
        return html;
    }

    private async domFromWeb(): Promise<JSDOM> {
        const dom = await JSDOM.fromURL(this._url);
        return dom;
    }

}
