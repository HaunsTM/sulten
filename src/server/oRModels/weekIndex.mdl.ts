import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IOccurence } from "../interfaces/oRModels/occurence.itf";
import { IWeekIndex } from "../interfaces/oRModels/weekIndex.itf";
import { Occurence } from "./occurence.mdl";

@Entity()
@Unique(["weekNumber", "weekYear"])
export class WeekIndex implements IWeekIndex {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public weekNumber: number;
    @Column()
    public weekYear: number;

    // navigation properties
    @OneToMany((type: IOccurence) => Occurence, (occurences: IOccurence) => occurences.weekIndex)
    public occurences: IOccurence[];

    constructor(id: number, weekNumber: number, weekYear: number) {
        this.id = id;
        this.weekNumber = weekNumber;
        this.weekYear = weekYear;
    }

}
