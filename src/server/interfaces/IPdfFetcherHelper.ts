import pdfjs from "pdfjs-dist";

export interface IPdfFetcherHelper {

    textContentFromPdfDocument( pageNumber: number ): Promise<string>;

    baseUrl: string;
    menuUrl: string;

}
