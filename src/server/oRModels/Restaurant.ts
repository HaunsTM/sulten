import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./Area";
import {Meal} from "./Meal";

@Entity()
export  class Restaurant {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public active: number;

    @Column()
    public name: string;

    @Column()
    public menuUrl: string;

    @Column()
    public typeScriptClassParser: string;


    @ManyToOne((type) => Area, (area) => area.restaurants)
    public area: Area;

    @OneToMany((type) => Meal, (meal) => meal.dish)
    public meals: Meal[];
}
