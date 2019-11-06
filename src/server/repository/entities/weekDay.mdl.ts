import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { EnumWeekDay } from "../../enum/weekDay.enu";
import { IOccurence } from "../interfaces/occurence.itf";
import { IWeekDay } from "../interfaces/weekDay.itf";
import { Occurence } from "./occurence.mdl";

@Entity()
@Unique(["javascriptDayIndex"])
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
