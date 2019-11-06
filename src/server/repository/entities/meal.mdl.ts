import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IDish } from "../interfaces/dish.itf";
import { IMeal } from "../interfaces/meal.itf";
import { IOccurence } from "../interfaces/occurence.itf";
import { IRestaurant } from "../interfaces/restaurant.itf";
import { Dish } from "./dish.mdl";
import { Occurence } from "./occurence.mdl";
import { Restaurant } from "./restaurant.mdl";

@Entity()
@Unique(["dish", "occurence", "restaurant"])
export class Meal implements IMeal {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public error: string;

    // navigation properties
    @ManyToOne((type: IDish) => Dish, (dish: Dish) => dish.meals)
    public dish: IDish;
    @ManyToOne((type: IOccurence) => Occurence, (occurence: IOccurence) => occurence.meals)
    public occurence: IOccurence;
    @ManyToOne((type: IRestaurant) => Restaurant, (restaurant: IRestaurant) => restaurant.meals)
    public restaurant: IRestaurant;

    constructor(id: number, dish: IDish, occurence: IOccurence, restaurant: IRestaurant) {
        this.id = id;
        this.dish = dish;
        this.occurence = occurence;
        this.restaurant = restaurant;
    }

}
