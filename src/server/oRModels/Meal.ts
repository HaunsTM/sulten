import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Dish} from "./Dish";
import {Occurence} from "./Occurence";
import { Restaurant } from "./Restaurant";

@Entity()
export class Meal {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @ManyToOne((type: Restaurant) => Dish, (dish: Dish) => dish.meals)
    public dish: Dish;
    @ManyToOne((type: Occurence) => Occurence, (occurence: Occurence) => occurence.meals)
    public occurence: Occurence;
    @ManyToOne((type: Restaurant) => Restaurant, (restaurant: Restaurant) => restaurant.meals)
    public restaurant: Restaurant;
}
