import _ from "lodash";
import { getConnection } from "typeorm";
import { LabelDishPrice } from "../../dto/LabelDishPrice";
import { LabelDishPriceDay } from "../../dto/LabelDishPriceDay";
import { RestaurantMeal } from "../../dto/RestaurantMeal";
import { RestaurantMealDay } from "../../dto/RestaurantMealDay";
import { IWebMealResult } from "../interfaces/IWebMealResult";
export class MealService {

    private readonly MEAL_SQL =
        " SELECT" +
        "	restaurants.name AS restaurantsName, restaurants.menuUrl AS restaurantsMenuUrl, labels.name AS labelsName, " +
        "   dishes.description AS dishesDescription," +
        "	prices.sek AS pricesSEK, weekDays.javaScriptDayIndex AS weekDaysJavaScriptDayIndex," +
        "	weekindexes.weekNumber AS weekindexesWeekNumber, weekindexes.weekYear AS weekindexesWeekYear" +
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
        "		JOIN weekindexes" +
        "			on weekindexes.id = occurrences.fKWeekIndexId" +
        "		JOIN weekDays" +
        "			on weekDays.id = occurrences.fKWeekDayId";

    public async createAndGetMealId(webMealResult: IWebMealResult): Promise<number> {

        try {
            const p_WeekDay_JavaScriptDayIndex = +webMealResult.weekDayJavascriptDayIndex;
            const p_WeekIndex_WeekNumber = +webMealResult.weekNumber;
            const p_WeekIndex_WeekYear = +webMealResult.weekYear;
            const p_Restaurant_MenuUrl = webMealResult.menuUrl;
            const p_Price_SEK = +webMealResult.price_SEK;
            const p_Label_Name = webMealResult.labelName;
            const p_Dish_Description = webMealResult.dishDescription;
            const p_Meal_Error = webMealResult.fetchError;

            const mealId: number = -1;

            const spResult = await getConnection()
                .query(`CALL CreateAndGetMealId(${p_WeekDay_JavaScriptDayIndex},${p_WeekIndex_WeekNumber},${p_WeekIndex_WeekYear},'${p_Restaurant_MenuUrl}',${p_Price_SEK},'${p_Label_Name}','${p_Dish_Description}','${p_Meal_Error}',@mealId)`);

            return mealId;

        } catch ( error ) {
            console.log( error );
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
            `    weekindexes.weekNumber = @p_weekNumber AND` +
            `    weekindexes.weekYear = @p_weekYear;`;

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
                        return new LabelDishPriceDay(
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
            `    weekindexes.weekNumber = @p_weekNumber AND` +
            `    weekindexes.weekYear = @p_weekYear;`;

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
                            return new LabelDishPrice(
                                ldp.labelsName, ldp.dishesDescription, ldp.pricesSEK ); },
                        );

                        const restaurantName = rw[0].restaurantsName;
                        const restaurantsMenuUrl = rw[0].restaurantsMenuUrl;
                        const restaurantMeal =
                            new RestaurantMeal(restaurantName, restaurantsMenuUrl, javaScriptDayIndex, labelDishPrice);

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
}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
