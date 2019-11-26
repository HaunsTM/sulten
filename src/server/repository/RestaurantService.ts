import { EntityRepository, getConnection, Repository } from "typeorm";
import { Restaurant } from "./entities/Restaurant";

export class RestaurantService {

    public async getAllRestaurants(): Promise<Restaurant[]> {
        const restaurants: Restaurant[] = await getConnection().getRepository(Restaurant).find();
        return restaurants;
    }

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
