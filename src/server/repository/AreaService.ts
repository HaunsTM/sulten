import { getConnection } from "typeorm";
import { Area } from "./entities/Area";

export class AreaService {
    private readonly AREA_SQL =
        " SELECT" +
        "	areas.id as areasId, areas.name as areasName" +
        " FROM" +
        "	areas;";

    public async getAllAreas(): Promise<Area[]> {

        const allAreasResult = await getConnection().query(this.AREA_SQL);
        const allAreas = allAreasResult.map( (a: any) => {
            const tempArea = new Area(a.areasId, a.areasName);

            return tempArea;
        });

        return allAreas;
    }

}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
