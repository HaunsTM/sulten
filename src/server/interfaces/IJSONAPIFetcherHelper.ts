import axios, { AxiosResponse } from "axios";
export interface IJSONAPIFetcherHelper {

    apiUrl: string;
    jSONResult(): Promise<AxiosResponse<any>>;

}
