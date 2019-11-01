import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IWeekIndex } from "../interfaces/oRModels/weekIndex.itf";
import { IOccurence } from "../interfaces/oRModels/occurence.itf";
import { Occurence } from "./occurence.mdl";

@Entity()
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
