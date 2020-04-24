import pdfjs from "pdfjs-dist";
import { IPdfFetcherHelper } from "../interfaces/IPdfFetcherHelper";

export class PdfFetcher implements IPdfFetcherHelper {
    private _pdfDocumentFromWeb: pdfjs.PDFDocumentProxy = null;
    private _pdfDocumentFromWebShouldBeUpdated: boolean = true;
    private _menuUrl: string = "";

    get menuUrl(): string {
        return this._menuUrl;
    }
    set menuUrl(value: string) {
        this._pdfDocumentFromWebShouldBeUpdated = true;
        this._menuUrl = value;
    }

    private _baseUrl: string = "";

    public get baseUrl(): string {
        return this._baseUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param baseUrl - Url of the webpage
     */
    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
        this.menuUrl = baseUrl;
    }

    public async textContentFromPdfDocument( ): Promise<string> {
        const maxPages = (await (this.pdfDocumentFromWeb())).numPages;
        const pageTextPromises = [];
        for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
          pageTextPromises.push(this.getPageText(pageNo));
        }
        const pageTextsArray = await Promise.all(pageTextPromises);
        const pageTexts = pageTextsArray.join(" ");
        return pageTexts;
    }

    private async getPageText( pageNumber: number ): Promise<string> {

        try {
            const pdfDocumentFromWeb = await this.pdfDocumentFromWeb();
            const page = await pdfDocumentFromWeb.getPage(pageNumber);
            const tokenizedText = await page.getTextContent();
            const pageText =
                tokenizedText.items.map( (t) => t.str).join("");

            return pageText;

        } catch ( e ) {

            throw Error("Couldn't get getTextContent from PDF-document " +
                        `"${this.menuUrl}" on page ${pageNumber}.`);
        }
    }

    private async pdfDocumentFromWeb(): Promise<pdfjs.PDFDocumentProxy> {
        try {

            if ( this._pdfDocumentFromWeb === null || this._pdfDocumentFromWebShouldBeUpdated === true) {
                this._pdfDocumentFromWeb =
                    await pdfjs.getDocument( this.menuUrl ).promise;
                this._pdfDocumentFromWebShouldBeUpdated = false;
            }

            return this._pdfDocumentFromWeb;

        } catch ( e ) {
            throw Error(`Couldn't successfully fetch data from ${this.menuUrl}: ${e.message}`);
        }
    }

}
