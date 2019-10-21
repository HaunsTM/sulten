import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Occurence} from "./Occurence";

@Entity()
export class WeekDay {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public JavascriptDayIndex: number;

    @Column()
    public Name_ENG: string;

    @Column()
    public Name_SE: string;

    @OneToMany((type) => Occurence, (occurences) => occurences.weekDay)
    public occurences: Occurence[];
}
