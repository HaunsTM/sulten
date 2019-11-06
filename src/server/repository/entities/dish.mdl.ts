import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IDish } from "../interfaces/dish.itf";
import { ILabel } from "../interfaces/label.itf";
import { IMeal } from "../interfaces/meal.itf";
import { Label } from "./label.mdl";
import { Meal } from "./meal.mdl";

@Entity()
@Unique(["description"])
export class Dish implements IDish {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public description: string;

    @Column()
    public priceSEK: string;

    // navigation properties
    @ManyToOne((type: ILabel) => Label, (label: ILabel) => label.dishes)
    public label: ILabel;
    @OneToMany((type: IMeal) => Meal, (meal: IMeal) => meal.dish)
    public meals: IMeal[];

    constructor(id: number, description: string, priceSEK: string) {
        this.id = id;
        this.description = description;
        this.priceSEK = priceSEK;
    }
}
