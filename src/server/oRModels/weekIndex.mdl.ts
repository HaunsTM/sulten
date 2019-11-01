import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IWeekIndex } from "../interfaces/oRModels/weekIndex.itf";
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
    @OneToMany((type: Occurence) => Occurence, (occurences: Occurence) => occurences.weekIndex)
    public occurences: Occurence[];

    
    constructor(id: number, weekNumber: number, weekYear: number) {
        this.id = id;
        this.weekNumber = weekNumber;
        this.weekYear = weekYear;
    }

}
