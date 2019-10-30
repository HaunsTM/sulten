import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IDish } from "../interfaces/oRModels/dish.itf";
import { IMeal } from "../interfaces/oRModels/meal.itf";
import { IOccurence } from "../interfaces/oRModels/occurence.itf";
import { IRestaurant } from "../interfaces/oRModels/restaurant.itf";
import { Dish } from "./dish.mdl";
import { Occurence } from "./occurence.mdl";
import { Restaurant } from "./restaurant.mdl";

@Entity()
export class Meal implements IMeal {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public error: Error;

    // navigation properties
    @ManyToOne((type: Restaurant) => Dish, (dish: Dish) => dish.meals)
    public dish: IDish;
    @ManyToOne((type: Occurence) => Occurence, (occurence: Occurence) => occurence.meals)
    public occurence: IOccurence;
    @ManyToOne((type: Restaurant) => Restaurant, (restaurant: Restaurant) => restaurant.meals)
    public restaurant: IRestaurant;

    constructor(id: number, dish: IDish, occurence: IOccurence, restaurant: IRestaurant) {
        this.id = id;
        this.dish = dish;
        this.occurence = occurence;
        this.restaurant = restaurant;
    }

}
