import { AlternativeIndex } from "../enum/AlternativeIndex";
import { LabelName } from "../enum/LabelName";
import { WeekDayIndex } from "../enum/WeekDayIndex";

export interface IWebMealResult {

    alternativeIndex: AlternativeIndex;

    dishDescription: string;

    price_SEK: string;

    labelName: LabelName;

    menuUrl: string;

    weekDayJavascriptDayIndex: WeekDayIndex;

    weekNumber: string;

    weekYear: string;

    fetchError: string;

}
