import { AlternativeIndex } from "../enum/AlternativeIndex";
import { LabelName } from "../enum/LabelName";
import { WeekDayIndex } from "../enum/WeekDayIndex";

export interface IDbWebMealResult {

    alternativeIndex: AlternativeIndex;

    dishDescription: string;

    price_SEK: number;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayIndex;

    weekNumber: number;

    weekYear: number;

    fetchError: string;

}
