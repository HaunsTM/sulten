import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import { WeekDayJavascriptDayIndex } from "../../enum/WeekDayJavascriptDayIndex";
import {Occurrence} from "./Occurrence";

@Entity("weekdays" , {schema: "dbsulten" } )
@Index("JavaScriptDayIndex", ["JavaScriptDayIndex"], {unique: true})
export class WeekDay {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "Id",
        })
    public Id: number;

    @Column("int", {
        nullable: false,
        unique: true,
        name: "JavaScriptDayIndex",
        })
    public JavaScriptDayIndex: number;

    @OneToMany(() => Occurrence, (occurrence: Occurrence) => occurrence.fkWeekDay, { onDelete: "RESTRICT" , onUpdate: "RESTRICT" })
    public occurrences: Occurrence[];

    constructor(javaScriptDayIndex: WeekDayJavascriptDayIndex) {
        this.JavaScriptDayIndex = javaScriptDayIndex;
    }

}
