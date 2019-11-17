import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Dish} from "./Dish";
import {Occurrence} from "./Occurrence";
import {Price} from "./Price";
import {Restaurant} from "./Restaurant";

@Entity("meals" , {schema: "dbsulten" } )
@Index("FK_Dish_Id", ["fkDish", "fkPrice", "fkOccurrence", "fkRestaurant"], {unique: true})
@Index("FK_Price_Id", ["fkPrice"])
@Index("FK_Occurrence_Id", ["fkOccurrence"])
@Index("FK_Restaurant_Id", ["fkRestaurant"])
export class Meal {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("varchar", {
        nullable: true,
        name: "Error",
        })
    public Error: string | null;

    @ManyToOne(() => Dish, (dish: Dish) => dish.meals, { onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Dish_Id"})
    public fkDish: Dish | null;

    @ManyToOne(() => Price, (price: Price) => price.meals, { onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Price_Id"})
    public fkPrice: Price | null;

    @ManyToOne(() => Occurrence, (occurrence: Occurrence) => occurrence.meals, { onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Occurrence_Id"})
    public fkOccurrence: Occurrence | null;

    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.meals, {  nullable: false, onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_Restaurant_Id"})
    public fkRestaurant: Restaurant | null;

}
