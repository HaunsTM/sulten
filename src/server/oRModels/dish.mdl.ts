import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IDish } from "../interfaces/oRModels/dish.itf";
import { ILabel } from "../interfaces/oRModels/label.itf";
import { IMeal } from "../interfaces/oRModels/meal.itf";
import { Label } from "./label.mdl";
import { Meal } from "./meal.mdl";

@Entity()
export class Dish implements IDish {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public description: string;

    @Column()
    public price_SEK: string;

    // navigation properties
    @ManyToOne((type: ILabel) => Label, (label: ILabel) => label.dishes)
    public label: ILabel;
    @OneToMany((type: IMeal) => Meal, (meal: IMeal) => meal.dish)
    public meals: IMeal[];

    constructor(id: number, description: string, price_SEK: string) {
        this.id = id;
        this.description = description;
        this.price_SEK = price_SEK;
    }
}
