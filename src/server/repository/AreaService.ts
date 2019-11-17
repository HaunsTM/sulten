import { EntityRepository, getConnection, Repository } from "typeorm";
import { Area } from "./entities/Area";

export class AreaService {

    public async getAllAreas(): Promise<Area[]> {
        const areas: Area[] = await getConnection().getRepository(Area).find();
        return areas;
    }

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
