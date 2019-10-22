import {Area} from "./Area";
import {Meal} from "./Meal";
import {WeekIndex} from "./WeekIndex";

export class Restaurant {

	public readonly weekIndex: WeekIndex;
	public readonly area: Area;

	public meals: Meal[];

	constructor(weekIndex: WeekIndex, area: Area) {
		this.weekIndex = weekIndex;
		this.area = area;
	}
}
