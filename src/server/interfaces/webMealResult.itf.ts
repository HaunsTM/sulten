import { EnumDishLabel } from "../enum/dishLabel.enu";
import { EnumWeekDay } from "../enum/weekday.enu";

export interface IWebMealResult {

    fetchUrl: string;

    dishDescription: string;

    dishPrice_SEK: string;

    dishLabel: EnumDishLabel;

    weekDay: EnumWeekDay;

    weekIndex: number;

    fetchError: Error;

}
