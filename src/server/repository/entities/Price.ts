import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Meal} from "./Meal";

@Entity("prices" , {schema: "dbsulten" } )
@Index("SEK", ["SEK"], {unique: true})
export class Price {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("decimal", {
        nullable: false,
        unique: true,
        precision: 4,
        scale: 2,
        name: "SEK",
        })
    public SEK: string;

    @OneToMany(() => Meal, (meal: Meal) => meal.fkPrice, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public meals: Meal[];

}
