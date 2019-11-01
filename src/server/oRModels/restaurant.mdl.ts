import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IArea } from "../interfaces/oRModels/area.itf";
import { IMeal } from "../interfaces/oRModels/meal.itf";
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

    // navigation properties
    @ManyToOne((type: Area) => Area, (area: Area) => area.restaurants)
    public area: Area;
    @OneToMany((type: Meal) => Meal, (meal: Meal) => meal.dish)
    public meals: Meal[];

    constructor(id: number, active: number, name: string, menuUrl: string) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.menuUrl = menuUrl;
    }

}
