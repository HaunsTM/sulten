import axios, { AxiosResponse } from "axios";
import { IJSONAPIFetcherHelper } from "../interfaces/IJSONAPIFetcherHelper";

export class JSONAPIFetcher implements IJSONAPIFetcherHelper {

    private _apiUrl: string = "";

    public get apiUrl(): string {
        return this._apiUrl;
    }

    /**
     * A helper class which can be used when parsing an online webpage
     * @param apiUrl - Url of the API
     */
    constructor(apiUrl: string) {
        this._apiUrl = apiUrl;
    }

    public async jSONResult(): Promise<AxiosResponse<any>> {
        try {
            const result = await axios.get( this._apiUrl );
            const json = result.data;
            return json;
        } catch ( e ) {

            throw Error(`Couldn't successfully fetch JSON from ${this.apiUrl}: ${e.message}`);
        }
    }

}
