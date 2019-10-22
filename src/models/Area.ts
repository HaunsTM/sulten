import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Restaurant} from "./Restaurant";

@Entity()
export class Area {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Name: string;

    @OneToMany((type) => Restaurant, (restaurant) => restaurant.area)
    public restaurants: Restaurant[];
}
