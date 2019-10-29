import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IArea } from "../interfaces/oRModels/area.itf";
import { Restaurant } from "./restaurant.mdl";

@Entity()
export class Area implements IArea {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;

    // navigation properties
    @OneToMany((type: Restaurant) => Restaurant, (restaurant: Restaurant) => restaurant.area)
    public restaurants: Restaurant[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
