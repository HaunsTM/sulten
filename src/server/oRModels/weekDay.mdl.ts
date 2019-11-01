import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnumWeekDay } from "../enum/weekday.enum";
import { IOccurence } from "../interfaces/oRModels/occurence.itf";
import { IWeekDay } from "../interfaces/oRModels/weekDay.itf";
import { Occurence } from "./occurence.mdl";

@Entity()
export class WeekDay implements IWeekDay {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public javascriptDayIndex: EnumWeekDay;

    // navigation properties
    @OneToMany((type: Occurence) => Occurence, (occurences: Occurence) => occurences.weekDay)
    public occurences: Occurence[];

    constructor(id: number, javascriptDayIndex: EnumWeekDay) {
        this.id = id;
        this.javascriptDayIndex = javascriptDayIndex;
    }
}
