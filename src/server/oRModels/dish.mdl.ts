import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IDish } from "../interfaces/oRModels/dish.itf";
import { Meal } from "./meal.mdl";

@Entity()
export class Dish implements IDish {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public description: string;

    // navigation properties
    @OneToMany((type: Meal) => Meal, (meal: Meal) => meal.dish)
    public meals: Meal[];

}
