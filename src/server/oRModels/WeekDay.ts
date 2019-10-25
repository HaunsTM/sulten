import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Occurence} from "./Occurence";

@Entity()
export class WeekDay {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public javascriptDayIndex: number;

    @OneToMany((type) => Occurence, (occurences) => occurences.weekDay)
    public occurences: Occurence[];
}
