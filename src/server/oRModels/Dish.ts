import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Meal} from "./Meal";

@Entity()
export  class Dish {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public description: string;

    @OneToMany((type: Meal) => Meal, (meal: Meal) => meal.dish)
    public meals: Meal[];
}
