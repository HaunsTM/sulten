import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Occurence} from "./Occurence";

@Entity()
export class WeekIndex {

    public Id: number;

    public WeekNumber: number;

    public WeekYear: number;

    public occurences: Occurence[];
}