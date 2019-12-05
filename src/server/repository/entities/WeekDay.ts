import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";

export class WeekDay {

    public id: number;

    public javaScriptDayIndex: number;

    constructor(javaScriptDayIndex: WeekDayJavascriptDayIndex) {

        this.javaScriptDayIndex = javaScriptDayIndex;

    }

}
