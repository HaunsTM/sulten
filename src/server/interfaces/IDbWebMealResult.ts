import { IndexNumber } from "../enum/IndexNumber";
import { LabelName } from "../enum/LabelName";
import { WeekDayIndex } from "../enum/WeekDayIndex";

export interface IDbWebMealResult {

    indexNumber: IndexNumber;

    dishDescription: string;

    price_SEK: number;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayIndex;

    weekNumber: number;

    weekYear: number;

    fetchError: string;

}
