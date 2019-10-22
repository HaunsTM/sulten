import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Meal} from "./Meal";
import {WeekDay} from "./WeekDay";
import {WeekIndex} from "./WeekIndex";

@Entity()
export class Occurence {

    public Id: number;

    public meals: Meal[];

    public weekDay: WeekDay;
    public weekIndex: WeekIndex;
}
