import _ from "lodash";
import { getConnection } from "typeorm";
import { AlternativeLabelDishPriceDay } from "../../dto/AlternativeLabelDishPriceDay";
import { RestaurantMeal } from "../../dto/RestaurantMeal";
import { RestaurantMealDay } from "../../dto/RestaurantMealDay";
import { logger } from "../helpers/default.logger";
import { IDbWebMealResult } from "../interfaces/IDbWebMealResult";
import { IWebMealResult } from "../interfaces/IWebMealResult";

export class MealService {

    private readonly MEAL_SQL =
        " SELECT" +
        " 	restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl," +
        " 	  T2.labelsName AS labelsName, T2.indexesNumber AS indexesNumber," +
        " 	  T2.dishesDescription AS dishesDescription," +
        " 	prices.sek AS pricesSEK, weekDays.dayIndex AS dayIndex," +
        " 	weekIndexes.weekNumber AS weekIndexesWeekNumber, weekIndexes.weekYear AS weekIndexesWeekYear" +
        " FROM meals AS m" +
        " JOIN prices" +
        " 	on prices.id = m.fKPriceId" +
        " JOIN restaurants" +
        " 	on restaurants.id = m.fKRestaurantId" +
        " 	JOIN areas" +
        " 		on areas.id = restaurants.fKAreaId" +
        " JOIN occurrences" +
        " 	on occurrences.id = m.fKOccurrenceId" +
        " 	JOIN weekIndexes" +
        " 		on weekIndexes.id = occurrences.fKWeekIndexId" +
        " 	JOIN weekDays" +
        " 		on weekDays.id = occurrences.fKWeekDayId" +
        " 	JOIN (SELECT alternativesMeals.fKMealId AS alternativesMealsFKMealId, indexes.number AS indexesNumber, dishes.description AS dishesDescription , labels.name AS labelsName" +
        " 			   FROM alternativesMeals" +
        " 			       JOIN alternatives" +
        " 			           on alternatives.id = alternativesMeals.fKAlternativeId" +
        " 			           JOIN dishes" +
        " 			               on alternatives.fKDishId = dishes.id" +
        " 			           JOIN indexes" +
        " 			               on alternatives.fKIndexId = indexes.id" +
        " 			           JOIN labels" +
        " 			               on alternatives.fKLabelId = labels.id) AS T2" +
        " 		on m.id = T2.alternativesMealsFKMealId";

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
                `${m.price_SEK}, '${m.labelName}', ${m.indexNumber}, ${m.dishDescription}, ${m.fetchError}); `;

        try {

            await queryRunner.startTransaction();

            const spResult = await queryRunner.query( sql );

            await queryRunner.commitTransaction();

            const mealId = spResult[0][0]["@MealId"];

            // logger.debug(`Performed ${sql}. mealID = ${mealId}`);
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

    }

    public async getMealsPerAreaWeekYear(
        areaId: number, weekNumber: number, weekYear: number): Promise<RestaurantMealDay[]> {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const filteredSQL =
            this.MEAL_SQL +
            ` WHERE` +
            `    areas.id = @p_areaId AND` +
            `	 restaurants.active = 1 AND` +
            `    NOT prices.sek = ${this.invalidSQLPrice} AND` +
            `    NOT dishesDescription = ${this.emptySQLString} AND` +
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
                            ldp.indexesNumber,
                            ldp.labelsName, ldp.dishesDescription, ldp.dayIndex, ldp.pricesSEK ); },
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

    public async getMealsPerAreaDayWeekYear(
        areaId: number, dayIndex: number, weekNumber: number, weekYear: number): Promise<RestaurantMeal[]> {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const filteredSQL =
            this.MEAL_SQL +
            ` WHERE` +
            `    areas.id = @p_areaId AND` +
            `	 restaurants.active = 1 AND` +
            `    NOT prices.sek = ${this.invalidSQLPrice} AND` +
            `    NOT dishesDescription = ${this.emptySQLString} AND` +
            `    weekDays.dayIndex = @p_javaScriptDayIndex AND` +
            `    weekIndexes.weekNumber = @p_weekNumber AND` +
            `    weekIndexes.weekYear = @p_weekYear;`;

        try {
            // lets now open a new transaction:
            await queryRunner.startTransaction();

            await queryRunner.query(`SET @p_areaId = ${areaId};`);
            await queryRunner.query(`SET @p_javaScriptDayIndex = ${dayIndex};`);
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
                            return new AlternativeLabelDishPriceDay(
                                ldp.indexesNumber,
                                ldp.labelsName, ldp.dishesDescription, ldp.dayIndex, ldp.pricesSEK ); },
                        );

                        const restaurantName = rw[0].restaurantsName;
                        const restaurantsMenuUrl = rw[0].restaurantsMenuUrl;
                        const restaurantMeal =
                            new RestaurantMeal(restaurantName, restaurantsMenuUrl, dayIndex, labelDishPrice);

                        return restaurantMeal;
                    })
                    .value();

            logger.debug(`Performed getMealsPerAreaAndDayAndWeekAndYear(${areaId}, ${dayIndex}, ${weekNumber}, ${weekYear}). Returning ${restaurantsMeals.length} restaurantsMeals.`);
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
        const fAlternativeIndex = +unfilteredWebMealResult.indexNumber;
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
            dishDescription: fDishDescription,
            fetchError: fFetchError,
            indexNumber: fAlternativeIndex,
            labelName: fLabelName,
            menuUrl: fMenuUrl,
            price_SEK: fPrice_SEK,
            weekDayJavascriptDayIndex: fWeekDayJavascriptDayIndex,
            weekNumber: fWeekNumber,
            weekYear: fWeekYear,
        };
    }
}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
