import { Area } from "../server/repository/entities/Area";
import { UrbanArea } from "../server/repository/entities/UrbanArea";

export class UrbanAreaAreas {

    public urbanArea: UrbanArea;

    public areas: Area[];

    constructor(
        urbanArea: UrbanArea,
        areas: Area[]) {

            this.urbanArea = urbanArea;
            this.areas = areas;
    }

}
