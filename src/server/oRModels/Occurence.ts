import {Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Meal} from "./Meal";
import {WeekDay} from "./WeekDay";
import {WeekIndex} from "./WeekIndex";

@Entity()
export  class Occurence {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @OneToMany((type) => Meal, (meal) => meal.dish)
    public meals: Meal[];

    @ManyToOne((type) => WeekDay, (weekDay) => weekDay.occurences)
    public weekDay: WeekDay;
    @ManyToOne((type) => WeekIndex, (weekIndex) => weekIndex.occurences)
    public weekIndex: WeekIndex;
}
