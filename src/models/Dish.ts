import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Meal} from "./Meal";

@Entity()
export class Dish {

    public Id: number;

    public Description: string;

    public meals: Meal[];
}
