import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";

export interface IWebMealResult {

    dishDescription: string;

    price_SEK: string;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;

    weekNumber: string;

    weekYear: string;

    fetchError: Error;

}
