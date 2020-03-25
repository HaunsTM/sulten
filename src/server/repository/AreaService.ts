import _ from "lodash";
import { getConnection } from "typeorm";
import { UrbanAreaAreas } from "../../dto/UrbanAreaAreas";
import { UrbanArea } from "./entities/UrbanArea";

export class AreaService {
    private readonly ALL_AREAS_PER_URBAN_AREAS_SQL =
        " SELECT" +
        "	urbanAreas.id AS urbanAreaId , urbanAreas.name AS urbanAreaName, areas.id as areaId, areas.name as areaName" +
        " FROM areas JOIN urbanAreas ON" +
        "	urbanAreas.id = areas.fKUrbanAreaId;";

    public async getAreasPerUrbanAreas(): Promise<UrbanAreaAreas[]> {

        const allAreasPerUrbanAreasResult = await getConnection().query(this.ALL_AREAS_PER_URBAN_AREAS_SQL);
        const allAreasPerUrbanAreas = _
            .chain(allAreasPerUrbanAreasResult)
            .groupBy("urbanAreaId")
            .map( (uAA: any) => {
                const tempUrbanArea = new UrbanArea(uAA[0]["urbanAreaId"], uAA[0]["urbanAreaName"]);
                const tempAreas =
                    uAA.map( (a: any) => {
                        return new UrbanArea(a["areaId"], a["areaName"]);
                    });
                const tempUrbanAreaWithAreas = new UrbanAreaAreas(tempUrbanArea, tempAreas);

                return tempUrbanAreaWithAreas;
            })
            .value();

        return allAreasPerUrbanAreas;
    }

}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
