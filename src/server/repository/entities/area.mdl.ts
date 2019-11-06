import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IArea } from "../interfaces/area.itf";
import { IRestaurant } from "../interfaces/restaurant.itf";
import { Restaurant } from "./restaurant.mdl";

@Entity()
@Unique(["name"])
export class Area implements IArea {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;

    // navigation properties
    @OneToMany((type: IRestaurant) => Restaurant, (restaurant: IRestaurant) => restaurant.area)
    public restaurants: IRestaurant[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

}
