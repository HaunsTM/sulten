import {Area} from "./Area";
import {Meal} from "./Meal";
import {WeekIndex} from "./WeekIndex";

export class MenuForAreaAndWeek {

	public weekIndex: WeekIndex;
	public area: Area;

	public meals: Meal[];

	constructor(weekIndex: WeekIndex, area: Area) {
		this.weekIndex = weekIndex;
		this.area = area;
	}
}
