import _ from "lodash";
import { getConnection } from "typeorm";
import { Restaurant } from "./entities/Restaurant";

export class RestaurantService {

    private readonly RESTAURANT_SQL =
        " SELECT restaurants.id AS restaurantsId, restaurants.active AS restaurantsActive, " +
        "     restaurants.name AS restaurantsName, restaurants.MenuUrl AS restaurantsMenuUrl,  " +
        "     restaurants.longitude AS restaurantsLongitude, restaurants.latitude AS restaurantsLatitude, " +
        "     restaurants.fKAreaId AS restaurantsFKAreaId " +
        " FROM restaurants ";

    public async getRestaurantsByActiveness(active: boolean): Promise<Restaurant[]> {

        const activeBit = active ? 1 : 0;

        const FILTERED_SQL =
            this.RESTAURANT_SQL +
            ` WHERE` +
            `	restaurants.Active = ${activeBit}`;

        const restaurantsByActivenessData = await getConnection().query(FILTERED_SQL);

        const restaurantsByActiveness =
            _(restaurantsByActivenessData)
                .map( ( r ) => {

                    const restaurant =
                        new Restaurant(
                            r.restaurantsName, r.restaurantsMenuUrl,
                            r.restaurantsLongitude, r.restaurantsLatitude);

                    return restaurant;
                })
               .value();

        return restaurantsByActiveness;
    }

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
