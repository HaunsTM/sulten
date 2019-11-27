import _ from "lodash";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { Restaurant } from "./entities/Restaurant";

export class RestaurantService {

    private readonly RESTAURANT_SQL =
        " SELECT restaurants.Id AS restaurantsId, restaurants.Active AS restaurantsActive, " +
        "     restaurants.Name AS restaurantsName, restaurants.MenuUrl AS restaurantsMenuUrl,  " +
        "     restaurants.Longitude AS restaurantsLongitude, restaurants.Latitude AS restaurantsLatitude, " +
        "     restaurants.FK_Area_Id AS restaurantsFK_Area_Id " +
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
                        new Restaurant(r.restaurantsId, r.restaurantsActive,
                        r.restaurantsName, r.restaurantsMenuUrl,
                        r.restaurantsLongitude, r.restaurantsLatitude);

                    return restaurant;
                })
               .value();

        return restaurantsByActiveness;
    }

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
