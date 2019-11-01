import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EnumDishLabel } from "../enum/dishLabel.enu";
import { IDish } from "../interfaces/oRModels/dish.itf";
import { ILabel } from "../interfaces/oRModels/label.itf";
import { Dish } from "./dish.mdl";

@Entity()
export class Label implements ILabel {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: EnumDishLabel;

    // navigation properties
    @OneToMany((type: IDish) => Dish, (dish: IDish) => dish.label)
    public dishes: IDish[];

    constructor(id: number, name: EnumDishLabel) {
        this.id = id;
        this.name = name;
    }
}
