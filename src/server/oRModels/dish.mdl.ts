import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IDish } from "../interfaces/oRModels/dish.itf";
import { Label } from "./label.mdl";
import { Meal } from "./meal.mdl";

@Entity()
export class Dish implements IDish {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public description: string;

    // navigation properties
    @ManyToOne((type) => Label, (label) => label.dishes)
    public label: Label;
    @OneToMany((type: Meal) => Meal, (meal: Meal) => meal.dish)
    public meals: Meal[];

}
