import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Meal} from "./Meal";

@Entity()
export class Dish {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Description: string;

    @OneToMany((type) => Meal, (meal) => meal.dish)
    public meals: Meal[];
}
