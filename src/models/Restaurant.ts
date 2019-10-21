import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./Area";
import {Meal} from "./Meal";

@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Active: number;

    @Column()
    public Name: string;

    @Column()
    public MenuUrl: string;

    @Column()
    public TypeScriptClassParser: string;


    @ManyToOne((type) => Area, (area) => area.restaurants)
    public area: Area;

    @OneToMany((type) => Meal, (meal) => meal.dish)
    public meals: Meal[];
}
