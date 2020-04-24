export interface IPdfFetcherHelper {

    baseUrl: string;
    menuUrl: string;

    textContentFromPdfDocument(): Promise<string>;

}
