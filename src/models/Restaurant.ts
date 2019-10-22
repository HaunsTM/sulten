import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./Area";
import {Meal} from "./Meal";

@Entity()
export class Restaurant {

    public Id: number;
    public Active: number;
    public Name: string;
    public MenuUrl: string;
    public TypeScriptClassParser: string;


    public area: Area;
    public meals: Meal[];
}
