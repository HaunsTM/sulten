

export default class WebMealResult implements IWebMenuDealer {

    public async fetchMealsFromWeb(): Promise<JSDOM> {
        const dom = await JSDOM.fromURL("http://www.miamarias.nu");
        return dom;
    }
    
    mealsFromWeb(): Promise<IWebMealResult[]> {

    };
  //  saveWebMenuToDb: Promise<boolean>;
    
}
