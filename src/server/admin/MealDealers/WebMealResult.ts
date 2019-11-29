import { LabelName } from "../../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import { IWebMealResult } from "../../interfaces/IWebMealResult";

export class WebMealResult implements IWebMealResult {

    private menuUrl: string;
    private dishDescription: string;
    private priceSEK: string;
    private labelName: LabelName;
    private weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;
    private weekNumber: string;
    private weekYear: string;
    private fetchError: Error;

    constructor(menuUrl: string, dishDescription: string, priceSEK: string,
                labelName: LabelName, weekDay: WeekDayJavascriptDayIndex,  weekNumber: string,
                weekYear: string, fetchError: Error) {

        this.menuUrl = menuUrl;
        this.dishDescription = dishDescription;
        this.priceSEK = priceSEK;
        this.labelName = labelName;
        this.weekDayJavascriptDayIndex = weekDay;
        this.weekNumber = weekNumber;
        this.weekYear = weekYear;

        this.fetchError = fetchError;
    }

    public get DishDescription(): string {
        return this.dishDescription;
    }

    public get Price_SEK(): string {
        return this.priceSEK;
    }

    public get LabelName(): LabelName {
        return this.labelName;
    }

    public get MenuUrl(): string {
        return this.menuUrl;
    }

    public get WeekDayJavascriptDayIndex(): WeekDayJavascriptDayIndex {
        return this.weekDayJavascriptDayIndex;
    }

    public get WeekNumber(): string {
        return this.weekNumber;
    }

    public get WeekYear(): string {
        return this.weekYear;
    }

    public get FetchError(): Error {
        return this.fetchError;
    }

}
