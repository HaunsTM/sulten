import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IRestaurant } from "../interfaces/oRModels/restaurant.itf";
import { Area } from "./area.mdl";
import { Meal } from "./meal.mdl";

@Entity()
export  class Restaurant implements IRestaurant {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public active: number;
    @Column()
    public name: string;
    @Column()
    public menuUrl: string;
    @Column()
    public typeScriptClassParser: string;

    // navigation properties
    @ManyToOne((type) => Area, (area) => area.restaurants)
    public area: Area;
    @OneToMany((type) => Meal, (meal) => meal.dish)
    public meals: Meal[];

}
