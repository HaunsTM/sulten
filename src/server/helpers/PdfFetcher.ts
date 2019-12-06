import pdfjs from "pdfjs-dist";
import { IPdfFetcherHelper } from "../interfaces/IPdfFetcherHelper";

export class PdfFetcher implements IPdfFetcherHelper {
    public actualRestaurantMenuUrl: string = "";

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

    public async textContentFromPdfDocument(
        pdfDocumentFromWeb: pdfjs.PDFDocumentProxy, pageNumber: number ): Promise<string> {

        try {

            const page = await pdfDocumentFromWeb.getPage(pageNumber);
            const tokenizedText = await page.getTextContent();
            const pageText =
                tokenizedText.items.map( (t) => { return t.str }).join("");

            return pageText;

        } catch ( e ) {

            throw Error("Couldn't get getTextContent from PDF-document " +
                        `"${this.actualRestaurantMenuUrl}" on page ${pageNumber}.`);
        }

    }

    public async pdfDocumentFromWeb(): Promise<pdfjs.PDFDocumentProxy> {
        try {
            const pdfDocumentFromWeb: pdfjs.PDFDocumentProxy  =
                await pdfjs.getDocument( this.actualRestaurantMenuUrl ).promise;

            return pdfDocumentFromWeb;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch data from ${this.actualRestaurantMenuUrl}: ${e.message}`);
        }
    }

}
