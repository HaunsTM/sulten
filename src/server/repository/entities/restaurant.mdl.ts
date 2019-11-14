import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IArea } from "../interfaces/area.itf";
import { IMeal } from "../interfaces/meal.itf";
import { IRestaurant } from "../interfaces/restaurant.itf";
import { Area } from "./area.mdl";
import { Meal } from "./meal.mdl";

@Entity()
@Unique(["menuUrl"])
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
    public longitude: number;
    @Column()
    public latitude: number;
    @Column()
    public typeScriptClassParser: string;

    // navigation properties
    @ManyToOne((type: IArea) => Area, (area: IArea) => area.restaurants)
    public area: IArea;
    @OneToMany((type: IMeal) => Meal, (meal: IMeal) => meal.dish)
    public meals: IMeal[];

    constructor(id: number, active: number, name: string, menuUrl: string) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.menuUrl = menuUrl;
    }

}
