import pdfjs from "pdfjs-dist";
import { IWebMenuUrl } from "./IWebMenuUrl";

export interface IPdfFetcherHelper extends IWebMenuUrl {

    textContentFromPdfDocument( pageNumber: number ): Promise<string>;

    // pdfDocumentFromWeb(): Promise<pdfjs.PDFDocumentProxy>;

}
