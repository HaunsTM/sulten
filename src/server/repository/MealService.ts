import _ from "lodash";
import { getConnection } from "typeorm";
import { AlternativeLabelDishPrice } from "../../dto/AlternativeLabelDishPrice";
import { AlternativeLabelDishPriceDay } from "../../dto/AlternativeLabelDishPriceDay";
import { RestaurantMeal } from "../../dto/RestaurantMeal";
import { RestaurantMealDay } from "../../dto/RestaurantMealDay";
import { logger } from "../helpers/default.logger";
import { IWebMealResult } from "../interfaces/IWebMealResult";
export class MealService {

    private readonly MEAL_SQL =
        " SELECT" +
        "	restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl," +
        "   alternatives.index AS alternativesIndex," +
        "   labels.name AS labelsName, " +
        "   dishes.description AS dishesDescription," +
        "	prices.sek AS pricesSEK, weekDays.javaScriptDayIndex AS weekDaysJavaScriptDayIndex," +
        "	weekIndexes.weekNumber AS weekIndexesWeekNumber, weekIndexes.weekYear AS weekIndexesWeekYear" +
        " FROM meals" +
        "	JOIN dishes" +
        "		on dishes.id = meals.fKDishId" +
        "		JOIN labels" +
        "			on labels.id = dishes.fKLabelId" +

        "		    JOIN labelsalternatives" +
        "			    on labelsalternatives.fKLabelId = labels.id" +
        "		        JOIN alternatives" +
        "			        on alternatives.id = labelsalternatives.fKAlternativeId" +

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
    public async createAndGetMealId(webMealResult: IWebMealResult): Promise<number> {

        const p_WeekDay_JavaScriptDayIndex = +webMealResult.weekDayJavascriptDayIndex;
        const p_WeekIndex_WeekNumber = +webMealResult.weekNumber;
        const p_WeekIndex_WeekYear = +webMealResult.weekYear;
        const p_Restaurant_MenuUrl = webMealResult.menuUrl;
        const p_Price_SEK = +webMealResult.price_SEK;
        const p_Label_Name = webMealResult.labelName;
        const pAlternative_Index = +webMealResult.alternativeIndex;
        const p_Dish_Description =
            webMealResult.dishDescription ? `'${webMealResult.dishDescription.replace(this.escapeRegex, "")}'` : `''`;
        const p_Meal_Error =
            webMealResult.fetchError ? `'${webMealResult.fetchError.replace(this.escapeRegex, "")}'` : null;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        const sql =
                ` CALL CreateAndGetMealId(` +
                `${p_WeekDay_JavaScriptDayIndex}, ${p_WeekIndex_WeekNumber}, ${p_WeekIndex_WeekYear}, '${p_Restaurant_MenuUrl}', ` +
                `${p_Price_SEK}, '${p_Label_Name}', ${pAlternative_Index}, ${p_Dish_Description}, ${p_Meal_Error}); `;

        try {

            await queryRunner.startTransaction();

            const spResult = await queryRunner.query( sql );

            await queryRunner.commitTransaction();

            const mealId = spResult[0][0]["LAST_INSERT_ID()"];

            logger.debug(`Performed ${sql}. mealID = ${mealId}`);
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
                            ldp.alternativesIndex,
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

        } catch (err) {

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
}

// tslint:disable-next-line:max-line-length
// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
