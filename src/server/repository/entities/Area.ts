import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {AreaName} from "../../enum/AreaName";
import {Restaurant} from "./Restaurant";

@Entity("areas" , {schema: "dbsulten" } )
@Index("Name", ["Name"], {unique: true})
export class Area {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("varchar", {
        nullable: false,
        unique: true,
        name: "Name",
        })
    public Name: string;

    @OneToMany(() => Restaurant, (restaurant: Restaurant) => restaurant.fkArea, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public restaurants: Restaurant[];

    constructor(name: AreaName) {
        this.Name = name;
    }
}
