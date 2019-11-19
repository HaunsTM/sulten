import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {LabelName} from "../../enum/LabelName";
import {Dish} from "./Dish";

@Entity("labels" , {schema: "dbsulten" } )
@Index("Name", ["Name"], {unique: true})
export class Label {

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

    @OneToMany(() => Dish, (dish: Dish) => dish.fkLabel, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public dishes: Dish[];

    constructor(name: LabelName) {
        this.Name = name;
    }

}
