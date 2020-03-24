import _ from "lodash";
import { getConnection } from "typeorm";
import { UrbanAreaAreas } from "../../dto/UrbanAreaAreas";

export class AreaService {
    private readonly ALL_AREAS_PER_URBAN_AREAS_SQL =
        " SELECT" +
        "	areas.id as areasId, areas.name as areasName, urbanAreas.name AS urbanAreaName " +
        " FROM areas JOIN urbanAreas ON" +
        "	urbanAreas.id = areas.fKUrbanAreaId;";

    public async getAreasPerUrbanAreas(): Promise<UrbanAreaAreas[]> {

        const allAreasPerUrbanAreasResult = await getConnection().query(this.ALL_AREAS_PER_URBAN_AREAS_SQL);
        const allAreasPerUrbanAreas = allAreasPerUrbanAreasResult.map( (a: any) => {
            const tempUrbanAreaWithAreas = new UrbanAreaAreas(a.areasId, a.areasName);

            return tempUrbanAreaWithAreas;
        });

        return allAreasPerUrbanAreas;
    }

}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
