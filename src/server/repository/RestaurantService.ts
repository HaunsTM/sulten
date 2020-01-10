import _ from "lodash";
import { getConnection } from "typeorm";
import { AreaRestaurants } from "../../dto/AreaRestaurants";
import { logger } from "../helpers/default.logger";
import { Area } from "./entities/Area";
import { Restaurant } from "./entities/Restaurant";

export class RestaurantService {

    private readonly RESTAURANT_SQL =
        " SELECT restaurants.id AS restaurantsId, restaurants.active AS restaurantsActive, " +
        "     restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl,  " +
        "     restaurants.longitude AS restaurantsLongitude, restaurants.latitude AS restaurantsLatitude, " +
        "     restaurants.fKAreaId AS restaurantsFKAreaId " +
        " FROM restaurants ";

    private readonly RESTAURANT_AREA_SQL =
        " SELECT restaurants.id AS restaurantsId, restaurants.active AS restaurantsActive, " +
        "     restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl,  " +
        "     restaurants.longitude AS restaurantsLongitude, restaurants.latitude AS restaurantsLatitude, " +
        "     restaurants.fKAreaId AS restaurantsFKAreaId, " +
        "     areas.id AS areasId, areas.name AS areasName " +
        " FROM restaurants "  +
        "   JOIN areas " +
        "		on areas.id = restaurants.fKAreaId";

    public async getRestaurantsByActiveness(active: boolean): Promise<Restaurant[]> {

        const activeBit = active ? 1 : 0;

        const FILTERED_SQL =
            this.RESTAURANT_SQL +
            ` WHERE` +
            `	restaurants.active = ${activeBit}`;

        const restaurantsByActivenessData = await getConnection().query(FILTERED_SQL);

        const restaurantsByActiveness =
            _(restaurantsByActivenessData)
                .map( ( r ) => {

                    const restaurant =
                        new Restaurant(
                            r.restaurantsId, this.bit2boolean(r.restaurantsActive.data),
                            r.restaurantsName, r.restaurantsMenuUrl,
                            r.restaurantsLongitude, r.restaurantsLatitude);

                    return restaurant;
                })
               .value();

        return restaurantsByActiveness;
    }

    public async getRestaurantsPerArea(areaId: number, restaurantIsActive: boolean): Promise<AreaRestaurants> {

        const activeBit = restaurantIsActive ? 1 : 0;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const filteredSQL =
            this.RESTAURANT_AREA_SQL +
            " WHERE" +
            "	restaurants.fKAreaId = @p_areaId AND " +
            "	restaurants.active = @p_restaurantIsActive";

        try {
            // lets now open a new transaction:
            await queryRunner.startTransaction();

            await queryRunner.query(`SET @p_areaId = ${areaId};`);
            await queryRunner.query(`SET @p_restaurantIsActive = ${activeBit};`);

            const restaurantsPerAreaData = await queryRunner.query(filteredSQL);

            // commit transaction now:
            await queryRunner.commitTransaction();

            if (restaurantsPerAreaData.length > 0) {
                const currentArea = new Area(restaurantsPerAreaData[0].areasId, restaurantsPerAreaData[0].areasName);
                const restaurants = restaurantsPerAreaData.map( ( r: any ) => {
                    return new Restaurant(
                        r.restaurantsId, this.bit2boolean(r.restaurantsActive[0]),
                        r.restaurantsName, r.restaurantsMenuUrl,
                        r.restaurantsLongitude, r.restaurantsLatitude );
                });

                const restaurantsPerArea = new AreaRestaurants(currentArea, restaurants);
                return restaurantsPerArea;
            }

            return null;

        } catch (error) {

            logger.error(`Error invoking ${filteredSQL}.\n\n ${error.stack}`);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private bit2boolean(bit: number): boolean {
        return bit === 1;
    }
}
// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
