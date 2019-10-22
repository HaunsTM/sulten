import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Occurence} from "./Occurence";

@Entity()
export class WeekDay {

    public Id: number;

    public JavascriptDayIndex: number;

    public Name_ENG: string;

    public Name_SE: string;

    public occurences: Occurence[];
}
