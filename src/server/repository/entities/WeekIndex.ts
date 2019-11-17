import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Occurrence} from "./Occurrence";

@Entity("weekindexes" , {schema: "dbsulten" } )
@Index("WeekNumber", ["WeekNumber", "WeekYear"], {unique: true})
export class WeekIndex {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("int", {
        nullable: false,
        name: "WeekNumber",
        })
    public WeekNumber: number;

    @Column("int", {
        nullable: false,
        name: "WeekYear",
        })
    public WeekYear: number;

    @OneToMany(() => Occurrence, (occurrence: Occurrence) => occurrence.fkWeekIndex, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public occurrences: Occurrence[];

}
