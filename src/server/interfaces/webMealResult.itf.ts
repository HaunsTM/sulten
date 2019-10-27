import { IArea } from "./oRModels/area.itf";
import { IDish } from "./oRModels/dish.itf";
import { ILabel } from "./oRModels/label.itf";
import { IOccurence } from "./oRModels/occurence.itf";
import { IRestaurant } from "./oRModels/restaurant.itf";
import { IWeekDay } from "./oRModels/weekDay.itf";
import { IWeekIndex } from "./oRModels/weekIndex.itf";

export interface IWebMealResult {

  area: IArea;
  dish: IDish;
  label: ILabel;
  meal: IRestaurant;
  occurence: IOccurence;
  weekDay: IWeekDay;
  weekIndex: IWeekIndex;

  fetchError: Error;

}
