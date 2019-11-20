import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Meal} from "./Meal";
import {WeekDay} from "./WeekDay";
import {WeekIndex} from "./WeekIndex";

@Entity("occurrences" , {schema: "dbsulten" } )
@Index("FK_WeekIndex_Id", ["fkWeekIndex", "fkWeekDay"], {unique: true})
@Index("FK_WeekDay_Id", ["fkWeekDay"])
export class Occurrence {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @ManyToOne(() => WeekIndex, (weekIndex: WeekIndex) => weekIndex.occurrences, {  nullable: false, onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_WeekIndex_Id"})
    public fkWeekIndex: WeekIndex | null;

    @ManyToOne(() => WeekDay, (weekDay: WeekDay) => weekDay.occurrences, {  nullable: false, onDelete: "RESTRICT", onUpdate: "RESTRICT" })
    @JoinColumn({ name: "FK_WeekDay_Id"})
    public fkWeekDay: WeekDay | null;

    @OneToMany(() => Meal, (meal: Meal) => meal.fkOccurrence, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public meals: Meal[];

}
