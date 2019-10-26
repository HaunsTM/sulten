import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { ILabel } from "../interfaces/oRModels/label.itf";
import { Dish } from "./dish.mdl";

@Entity()
export class Label implements ILabel {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: EnumDishLabel;

    // navigation properties
    @OneToMany((type: Dish) => Dish, (dish: Dish) => dish.label)
    public dishes: Dish[];

}
