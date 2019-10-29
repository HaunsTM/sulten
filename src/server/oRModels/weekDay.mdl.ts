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
    @OneToMany((type: Occurence) => Occurence, (occurences: Occurence) => occurences.weekDay)
    public occurences: Occurence[];

    constructor(id: number, javascriptDayIndex: number) {
        this.id = id;
        this.javascriptDayIndex = javascriptDayIndex;
    }
}
