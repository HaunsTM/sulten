import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IMeal } from "../interfaces/meal.itf";
import { IOccurence } from "../interfaces/occurence.itf";
import { IWeekDay } from "../interfaces/weekDay.itf";
import { IWeekIndex } from "../interfaces/weekIndex.itf";
import { Meal } from "./meal.mdl";
import { WeekDay } from "./weekDay.mdl";
import { WeekIndex } from "./weekIndex.mdl";

@Entity()
@Unique(["weekDay", "weekIndex"])
export class Occurence implements IOccurence {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    // navigation properties
    @OneToMany((type: IMeal) => Meal, (meal: IMeal) => meal.dish)
    public meals: IMeal[];
    @ManyToOne((type: IWeekDay) => WeekDay, (weekDay: IWeekDay) => weekDay.occurences)
    public weekDay: IWeekDay;
    @ManyToOne((type: IWeekIndex) => WeekIndex, (weekIndex: IWeekIndex) => weekIndex.occurences)
    public weekIndex: IWeekIndex;

    constructor(id: number, weekDay: IWeekDay, weekIndex: IWeekIndex) {
        this.id = id;
        this.weekDay = weekDay;
        this.weekIndex = weekIndex;
    }

}
