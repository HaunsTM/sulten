import _ from "lodash";
import { EntityRepository, getConnection, Repository } from "typeorm";
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
        "	prices.sek AS pricesSEK, weekdays.javaScriptDayIndex AS weekdaysJavaScriptDayIndex," +
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
        "		JOIN weekdays" +
        "			on weekdays.id = occurrences.fKWeekDayId";

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

        await Promise.all(allInserts);
    }

    public async getMealsPerAreaAndWeekAndYear(
        areaId: number, weekNumber: number, weekYear: number): Promise<RestaurantMealDay[]> {

        const FILTERED_SQL =
            this.MEAL_SQL +
            ` WHERE` +
            `	areas.id = ${areaId} AND` +
            `	weekindexes.weekNumber = ${weekNumber} AND` +
            `	weekindexes.weekYear = ${weekYear}`;

        const mealsAreaAndData = await getConnection().query(FILTERED_SQL);
        const restaurantsMeals =
            _(mealsAreaAndData)
                .groupBy("restaurantsName")
                .map( ( rw ) => {

                    const labelDishPriceDays = rw.map( (ldp) => {
                        return new LabelDishPriceDay(
                            ldp.labelsName, ldp.dishesDescription, ldp.weekdaysJavaScriptDayIndex, ldp.pricesSEK ); },
                    );

                    const restaurantName = rw[0].restaurantsName;
                    const restaurantsMenuUrl = rw[0].restaurantsMenuUrl;
                    const restaurantMeal =
                        new RestaurantMealDay(restaurantName, restaurantsMenuUrl, labelDishPriceDays);

                    return restaurantMeal;
                })
               .value();

        return restaurantsMeals;

    }

    public async getMealsPerAreaAndDayAndWeekAndYear(
        areaId: number, javaScriptDayIndex: number, weekNumber: number, weekYear: number): Promise<RestaurantMeal[]> {

        const FILTERED_SQL =
            this.MEAL_SQL +
            ` WHERE` +
            `	areas.id = ${areaId} AND` +
            `	weekdays.javaScriptDayIndex = ${javaScriptDayIndex} AND` +
            `	weekindexes.weekNumber = ${weekNumber} AND` +
            `	weekindexes.weekYear = ${weekYear}`;

        const mealsAreaAndData = await getConnection().query(FILTERED_SQL);
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

    }
}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
