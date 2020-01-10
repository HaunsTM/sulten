import pdfjs from "pdfjs-dist";

export interface IPdfFetcherHelper {

    baseUrl: string;
    menuUrl: string;

    textContentFromPdfDocument( pageNumber: number ): Promise<string>;

}
