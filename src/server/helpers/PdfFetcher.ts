import pdfjs from "pdfjs-dist";
import { IPdfFetcherHelper } from "../interfaces/IPdfFetcherHelper";

export class PdfFetcher implements IPdfFetcherHelper {
    private _pdfDocumentFromWeb: pdfjs.PDFDocumentProxy = null;
    private _pdfDocumentFromWebShouldBeUpdated: boolean = true;
    private _actualRestaurantMenuUrl: string = "";

    get actualRestaurantMenuUrl(): string {
        return this._actualRestaurantMenuUrl;
    }
    set actualRestaurantMenuUrl(value: string) {
        this._pdfDocumentFromWebShouldBeUpdated = true;
        this._actualRestaurantMenuUrl = value;
    }

    private _initialBaseMenuUrl: string = "";

    public get initialBaseMenuUrl(): string {
        return this._initialBaseMenuUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param baseUrl - Url of the webpage
     */
    constructor(initialBaseMenuUrl: string) {
        this._initialBaseMenuUrl = initialBaseMenuUrl;
        this.actualRestaurantMenuUrl = initialBaseMenuUrl;
    }

    public async textContentFromPdfDocument( pageNumber: number ): Promise<string> {

        try {
            const pdfDocumentFromWeb = await this.pdfDocumentFromWeb();
            const page = await pdfDocumentFromWeb.getPage(pageNumber);
            const tokenizedText = await page.getTextContent();
            const pageText =
                tokenizedText.items.map( (t) => t.str).join("");

            return pageText;

        } catch ( e ) {

            throw Error("Couldn't get getTextContent from PDF-document " +
                        `"${this.actualRestaurantMenuUrl}" on page ${pageNumber}.`);
        }

    }

    private async pdfDocumentFromWeb(): Promise<pdfjs.PDFDocumentProxy> {
        try {

            if ( this._pdfDocumentFromWeb === null || this._pdfDocumentFromWebShouldBeUpdated === true) {
                this._pdfDocumentFromWeb =
                    await pdfjs.getDocument( this.actualRestaurantMenuUrl ).promise;
                this._pdfDocumentFromWebShouldBeUpdated = false;
            }

            return this._pdfDocumentFromWeb;

        } catch ( e ) {
            throw Error(`Couldn't successfully fetch data from ${this.actualRestaurantMenuUrl}: ${e.message}`);
        }
    }

}
