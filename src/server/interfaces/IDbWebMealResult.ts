import { AlternativeIndex } from "../enum/AlternativeIndex";
import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";

export interface IDbWebMealResult {

    alternativeIndex: AlternativeIndex;

    dishDescription: string;

    price_SEK: number;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayJavascriptDayIndex;

    weekNumber: number;

    weekYear: number;

    fetchError: string;

}
