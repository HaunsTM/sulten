import { IndexNumber } from "../enum/IndexNumber";
import { LabelName } from "../enum/LabelName";
import { WeekDayIndex } from "../enum/WeekDayIndex";

export interface IWebMealResult {

    indexNumber: IndexNumber;

    dishDescription: string;

    price_SEK: string;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayIndex;

    weekNumber: string;

    weekYear: string;

    fetchError: string;

}
