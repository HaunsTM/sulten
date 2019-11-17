import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Area} from "./Area";
import {Meal} from "./Meal";

@Entity("restaurants" , {schema: "dbsulten" } )
@Index("MenuUrl", ["MenuUrl"], {unique: true})
@Index("TypeScriptClassParser", ["TypeScriptClassParser"], {unique: true})
@Index("FK_Area_Id", ["fkArea"])
export class Restaurant {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("bit", {
        nullable: false,
        name: "Active",
        })
    public Active: boolean;

    @Column("varchar", {
        nullable: false,
        name: "Name",
        })
    public Name: string;

    @Column("varchar", {
        nullable: false,
        unique: true,
        name: "MenuUrl",
        })
    public MenuUrl: string;

    @Column("varchar", {
        nullable: false,
        unique: true,
        name: "TypeScriptClassParser",
        })
    public TypeScriptClassParser: string;

    @Column("decimal", {
        nullable: false,
        precision: 11,
        scale: 8,
        name: "Longitude",
        })
    public Longitude: string;

    @Column("decimal", {
        nullable: false,
        precision: 10,
        scale: 8,
        name: "Latitude",
        })
    public Latitude: string;

    @ManyToOne(() => Area, (area: Area) => area.restaurants, {  nullable: false, onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Area_Id"})
    public fkArea: Area | null;

    @OneToMany(() => Meal, (meal: Meal) => meal.fkRestaurant, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public meals: Meal[];

}
