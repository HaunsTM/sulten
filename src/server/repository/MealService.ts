import { EntityRepository, getConnection, Repository } from "typeorm";
import { IWebMealResult } from "../interfaces/IWebMealResult";
import { Dish } from "./entities/Dish";
import { Occurrence } from "./entities/Occurrence";
import { Restaurant } from "./entities/Restaurant";
export class MealService {

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

}

// https://levelup.gitconnected.com/complete-guide-to-using-typeorm-and-typescript-for-data-persistence-in-node-js-module-bfce169959d9
