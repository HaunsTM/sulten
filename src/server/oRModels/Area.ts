import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Restaurant} from "./Restaurant";

@Entity()
export class Area {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany((type: Restaurant) => Restaurant, (restaurant: Restaurant) => restaurant.area)
    public restaurants: Restaurant[];
}
