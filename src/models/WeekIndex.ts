import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Occurence} from "./Occurence";

@Entity()
export class WeekIndex {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public WeekNumber: number;

    @Column()
    public WeekYear: number;

    @OneToMany((type) => Occurence, (occurences) => occurences.weekIndex)
    public occurences: Occurence[];
}
