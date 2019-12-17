
export interface IWebMenuUrl {

    getActualRestaurantMenuUrlAsync: Promise<string>;

    initialBaseMenuUrl: string;

}
