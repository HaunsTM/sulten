import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Dish} from "./Dish";
import {Occurence} from "./Occurence";
import {Restaurant} from "./Restaurant";

@Entity()
export class Meal {

    @PrimaryGeneratedColumn()
    public Id: number;

    @ManyToOne((type) => Dish, (dish) => dish.meals)
    public dish: Dish;
    @ManyToOne((type) => Occurence, (occurence) => occurence.meals)
    public occurence: Occurence;
    @ManyToOne((type) => Restaurant, (restaurant) => restaurant.meals)
    public restaurant: Restaurant;
}
