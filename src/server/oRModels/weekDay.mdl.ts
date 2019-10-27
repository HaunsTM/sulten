import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IWeekDay } from "../interfaces/oRModels/weekDay.itf";
import { Occurence } from "./occurence.mdl";

@Entity()
export class WeekDay implements IWeekDay {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public javascriptDayIndex: number;

    // navigation properties
    @OneToMany((type) => Occurence, (occurences) => occurences.weekDay)
    public occurences: Occurence[];

}
