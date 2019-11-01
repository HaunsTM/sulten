import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnumWeekDay } from "../enum/weekDay.enum";
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
    @OneToMany((type: IOccurence) => Occurence, (occurences: IOccurence) => occurences.weekDay)
    public occurences: IOccurence[];

    constructor(id: number, javascriptDayIndex: EnumWeekDay) {
        this.id = id;
        this.javascriptDayIndex = javascriptDayIndex;
    }
}
