import { Area } from "../server/repository/entities/Area";
import { UrbanArea } from "../server/repository/entities/UrbanArea";

export class UrbanAreaAreas {

    public urbanAreaId: number;
    public urbanAreaName: string;

    public areas: Area[];

    constructor(
        urbanArea: UrbanArea,
        areas: Area[]) {

            this.urbanAreaId = urbanArea.id;
            this.urbanAreaName = urbanArea.name;
            this.areas = areas;
    }

}
