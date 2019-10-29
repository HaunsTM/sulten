import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IOccurence } from "../interfaces/oRModels/occurence.itf";
import { Meal } from "./meal.mdl";
import { WeekDay } from "./weekDay.mdl";
import { WeekIndex } from "./weekIndex.mdl";

@Entity()
export class Occurence implements IOccurence {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    // navigation properties
    @OneToMany((type: Meal) => Meal, (meal: Meal) => meal.dish)
    public meals: Meal[];
    @ManyToOne((type: WeekDay) => WeekDay, (weekDay: WeekDay) => weekDay.occurences)
    public weekDay: WeekDay;
    @ManyToOne((type: WeekIndex) => WeekIndex, (weekIndex: WeekIndex) => weekIndex.occurences)
    public weekIndex: WeekIndex;

}
