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
        "	restaurants.Name AS restaurantsName, restaurants.MenuUrl AS restaurantsMenuUrl, labels.Name AS labelsName, " +
        "   dishes.Description AS dishesDescription," +
        "	prices.SEK AS pricesSEK, weekdays.JavaScriptDayIndex AS weekdaysJavaScriptDayIndex," +
        "	weekindexes.WeekNumber AS weekindexesWeekNumber, weekindexes.WeekYear AS weekindexesWeekYear" +
        " FROM meals" +
        "	JOIN dishes" +
        "		on dishes.id = meals.FK_Dish_Id" +
        "		JOIN labels" +
        "			on labels.id = dishes.FK_Label_Id" +
        "	JOIN prices" +
        "		on prices.id = meals.FK_Price_Id" +
        "	JOIN restaurants" +
        "		on restaurants.id = meals.FK_Restaurant_Id" +
        "		JOIN areas" +
        "			on areas.id = restaurants.FK_Area_Id" +
        "	JOIN occurrences" +
        "		on occurrences.id = meals.FK_Occurrence_Id" +
        "		JOIN weekindexes" +
        "			on weekindexes.id = occurrences.FK_WeekIndex_Id" +
        "		JOIN weekdays" +
        "			on weekdays.id = occurrences.FK_WeekDay_Id";

    public async createAndGetMealId(webMealResult: IWebMealResult): Promise<number> {

        try {
            const p_WeekDay_JavaScriptDayIndex = +webMealResult.WeekDayJavascriptDayIndex;
            const p_WeekIndex_WeekNumber = +webMealResult.WeekNumber;
            const p_WeekIndex_WeekYear = +webMealResult.WeekYear;
            const p_Restaurant_MenuUrl = webMealResult.MenuUrl;
            const p_Price_SEK = +webMealResult.Price_SEK;
            const p_Label_Name = webMealResult.LabelName;
            const p_Dish_Description = webMealResult.DishDescription;
            const p_Meal_Error = webMealResult.FetchError;

            const mealId: number = -1;

            const spResult = await getConnection()
                .query(`CALL CreateAndGetMeal_Id(${p_WeekDay_JavaScriptDayIndex},${p_WeekIndex_WeekNumber},${p_WeekIndex_WeekYear},'${p_Restaurant_MenuUrl}',${p_Price_SEK},'${p_Label_Name}','${p_Dish_Description}','${p_Meal_Error}',@mealId)`);

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
            `	weekindexes.WeekNumber = ${weekNumber} AND` +
            `	weekindexes.WeekYear = ${weekYear}`;

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
            `	weekdays.JavaScriptDayIndex = ${javaScriptDayIndex} AND` +
            `	weekindexes.WeekNumber = ${weekNumber} AND` +
            `	weekindexes.WeekYear = ${weekYear}`;

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