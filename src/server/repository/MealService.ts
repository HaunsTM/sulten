import _ from "lodash";
import { getConnection } from "typeorm";
import { AlternativeLabelDishPrice } from "../../dto/AlternativeLabelDishPrice";
import { AlternativeLabelDishPriceDay } from "../../dto/AlternativeLabelDishPriceDay";
import { RestaurantMeal } from "../../dto/RestaurantMeal";
import { RestaurantMealDay } from "../../dto/RestaurantMealDay";
import { logger } from "../helpers/default.logger";
import { IDbWebMealResult } from "../interfaces/IDbWebMealResult";
import { IWebMealResult } from "../interfaces/IWebMealResult";

export class MealService {

    private readonly MEAL_SQL =
        " SELECT" +
        "	restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl," +
        "   labels.name AS labelsName, labels.alternativeIndex AS labelsAlternativeIndex," +
        "   dishes.description AS dishesDescription," +
        "	prices.sek AS pricesSEK, weekDays.javaScriptDayIndex AS weekDaysJavaScriptDayIndex," +
        "	weekIndexes.weekNumber AS weekIndexesWeekNumber, weekIndexes.weekYear AS weekIndexesWeekYear" +
        " FROM meals" +
        "	JOIN dishes" +
        "		on dishes.id = meals.fKDishId" +
        "		JOIN labels" +
        "			on labels.id = dishes.fKLabelId" +

        "	JOIN prices" +
        "		on prices.id = meals.fKPriceId" +
        "	JOIN restaurants" +
        "		on restaurants.id = meals.fKRestaurantId" +
        "		JOIN areas" +
        "			on areas.id = restaurants.fKAreaId" +
        "	JOIN occurrences" +
        "		on occurrences.id = meals.fKOccurrenceId" +
        "		JOIN weekIndexes" +
        "			on weekIndexes.id = occurrences.fKWeekIndexId" +
        "		JOIN weekDays" +
        "			on weekDays.id = occurrences.fKWeekDayId";

    private readonly escapeRegex = /["'\n\\]/g;
    private readonly emptySQLString = "''";
    private readonly invalidSQLPrice = -1;

    public async createAndGetMealId(webMeal: IWebMealResult): Promise<number> {
        const m = this.dbPreparedWebMeal(webMeal);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const sql =
                ` CALL CreateAndGetMealId(` +
                `${m.weekDayJavascriptDayIndex}, ${m.weekNumber}, ${m.weekYear}, '${m.menuUrl}', ` +
                `${m.price_SEK}, '${m.labelName}', ${m.alternativeIndex}, ${m.dishDescription}, ${m.fetchError}); `;

        try {

            await queryRunner.startTransaction();

            const spResult = await queryRunner.query( sql );

            await queryRunner.commitTransaction();

            const mealId = spResult[0][0]["LAST_INSERT_ID()"];

            //logger.debug(`Performed ${sql}. mealID = ${mealId}`);
            return mealId;

        } catch ( error ) {
            logger.error(`Error invoking ${sql}.\n\n ${error.stack}`);
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    public async bulkInsert(meals: IWebMealResult[]): Promise<void> {
        const allInserts = meals.map( (m) => this.createAndGetMealId(m) );

        const allInsertsResult = await Promise.all(allInserts);
    }

    public async getMealsPerAreaAndWeekAndYear(
        areaId: number, weekNumber: number, weekYear: number): Promise<RestaurantMealDay[]> {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const filteredSQL =
            this.MEAL_SQL +
            ` WHERE` +
            `    areas.id = @p_areaId AND` +
            `    NOT prices.sek = ${this.invalidSQLPrice} AND` +
            `    NOT dishes.description = ${this.emptySQLString} AND` +
            `    weekIndexes.weekNumber = @p_weekNumber AND` +
            `    weekIndexes.weekYear = @p_weekYear;`;

        try {
            // lets now open a new transaction:
            await queryRunner.startTransaction();

            await queryRunner.query(`SET @p_areaId = ${areaId};`);
            await queryRunner.query(`SET @p_weekNumber = ${weekNumber};`);
            await queryRunner.query(`SET @p_weekYear = ${weekYear};`);

            const mealsAreaAndData = await queryRunner.query(filteredSQL);

            // commit transaction now:
            await queryRunner.commitTransaction();

            const restaurantsMeals =
            _(mealsAreaAndData)
                .groupBy("restaurantsName")
                .map( ( rw ) => {

                    const labelDishPriceDays = rw.map( (ldp) => {
                        return new AlternativeLabelDishPriceDay(
                            ldp.labelsAlternativeIndex,
                            ldp.labelsName, ldp.dishesDescription, ldp.weekDaysJavaScriptDayIndex, ldp.pricesSEK ); },
                    );

                    const restaurantName = rw[0].restaurantsName;
                    const restaurantsMenuUrl = rw[0].restaurantsMenuUrl;
                    const restaurantMeal =
                        new RestaurantMealDay(restaurantName, restaurantsMenuUrl, labelDishPriceDays);

                    return restaurantMeal;
                })
               .value();

            return restaurantsMeals;

        } catch (error) {

            logger.error(`Error invoking ${filteredSQL}.\n\n ${error.stack}`);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }

    }

    public async getMealsPerAreaAndDayAndWeekAndYear(
        areaId: number, javaScriptDayIndex: number, weekNumber: number, weekYear: number): Promise<RestaurantMeal[]> {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const filteredSQL =
            this.MEAL_SQL +
            ` WHERE` +
            `    areas.id = @p_areaId AND` +
            `    weekDays.javaScriptDayIndex = @p_javaScriptDayIndex AND` +
            `    weekIndexes.weekNumber = @p_weekNumber AND` +
            `    weekIndexes.weekYear = @p_weekYear;`;

        try {
            // lets now open a new transaction:
            await queryRunner.startTransaction();

            await queryRunner.query(`SET @p_areaId = ${areaId};`);
            await queryRunner.query(`SET @p_javaScriptDayIndex = ${javaScriptDayIndex};`);
            await queryRunner.query(`SET @p_weekNumber = ${weekNumber};`);
            await queryRunner.query(`SET @p_weekYear = ${weekYear};`);

            const mealsAreaAndData = await queryRunner.query(filteredSQL);

            // commit transaction now:
            await queryRunner.commitTransaction();

            const restaurantsMeals =
                _(mealsAreaAndData)
                    .groupBy("restaurantsName")
                    .map( ( rw ) => {

                        const labelDishPrice = rw.map( (ldp) => {
                            return new AlternativeLabelDishPrice(
                                ldp.alternativesIndex,
                                ldp.labelsName, ldp.dishesDescription, ldp.pricesSEK ); },
                        );

                        const restaurantName = rw[0].restaurantsName;
                        const restaurantsMenuUrl = rw[0].restaurantsMenuUrl;
                        const restaurantMeal =
                            new RestaurantMeal(restaurantName, restaurantsMenuUrl, javaScriptDayIndex, labelDishPrice);

                        return restaurantMeal;
                    })
                    .value();

            logger.debug(`Performed getMealsPerAreaAndDayAndWeekAndYear(${areaId}, ${javaScriptDayIndex}, ${weekNumber}, ${weekYear}). Returning ${restaurantsMeals.length} restaurantsMeals.`);
            return restaurantsMeals;

        } catch (error) {

            logger.error(`Error invoking ${filteredSQL}.\n\n ${error.stack}`);
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();

        } finally {

            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    private dbPreparedWebMeal(unfilteredWebMealResult: IWebMealResult): IDbWebMealResult {

        const fWeekDayJavascriptDayIndex = +unfilteredWebMealResult.weekDayJavascriptDayIndex;
        const fWeekNumber = +unfilteredWebMealResult.weekNumber;
        const fWeekYear = +unfilteredWebMealResult.weekYear;
        const fMenuUrl = unfilteredWebMealResult.menuUrl;
        let fPrice_SEK: number;
        const fLabelName = unfilteredWebMealResult.labelName;
        const fAlternativeIndex = +unfilteredWebMealResult.alternativeIndex;
        let fDishDescription: string;
        let fFetchError: string;

        if (unfilteredWebMealResult.fetchError) {
            fDishDescription = this.emptySQLString;
            fPrice_SEK = this.invalidSQLPrice;
            fFetchError = `'${unfilteredWebMealResult.fetchError.replace(this.escapeRegex, "")}'`;
        } else {
            fDishDescription = unfilteredWebMealResult.dishDescription ? `'${unfilteredWebMealResult.dishDescription.replace(this.escapeRegex, "")}'` : this.emptySQLString;
            fPrice_SEK = +unfilteredWebMealResult.price_SEK;
            fFetchError = null;
        }
        return {
            alternativeIndex: fAlternativeIndex,
            dishDescription: fDishDescription,
            price_SEK: fPrice_SEK,
            labelName: fLabelName,
            menuUrl: fMenuUrl,
            weekDayJavascriptDayIndex: fWeekDayJavascriptDayIndex,
            weekNumber: fWeekNumber,
            weekYear: fWeekYear,
            fetchError: fFetchError,
        };
    }
}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
