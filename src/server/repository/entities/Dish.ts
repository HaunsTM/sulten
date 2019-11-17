import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Label} from "./Label";
import {Meal} from "./Meal";

@Entity("dishes" , {schema: "dbsulten" } )
@Index("Description", ["Description", "fkLabel"], {unique: true})
@Index("FK_Label_Id", ["fkLabel"])
export class Dish {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("varchar", {
        nullable: false,
        name: "Description",
        })
    public Description: string;

    @ManyToOne(() => Label, (label: Label) => label.dishes, {  nullable: false, onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Label_Id"})
    public fkLabel: Label | null;

    @OneToMany(() => Meal, (meal: Meal) => meal.fkDish, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public meals: Meal[];

}
