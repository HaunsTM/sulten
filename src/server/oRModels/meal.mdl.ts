import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "./dish.mdl";
import { IMeal } from "../interfaces/oRModels/meal.itf";
import { Occurence } from "./occurence.mdl";
import { Restaurant } from "./restaurant.mdl";

@Entity()
export class Meal implements IMeal {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    // navigation properties
    @ManyToOne((type: Restaurant) => Dish, (dish: Dish) => dish.meals)
    public dish: Dish;
    @ManyToOne((type: Occurence) => Occurence, (occurence: Occurence) => occurence.meals)
    public occurence: Occurence;
    @ManyToOne((type: Restaurant) => Restaurant, (restaurant: Restaurant) => restaurant.meals)
    public restaurant: Restaurant;

}
