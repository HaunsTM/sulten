import { getConnection } from "typeorm";
import { AreaName } from "../enum/AreaName";
import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";
import { Area } from "./entities/Area";
import { Label } from "./entities/Label";
import { Restaurant } from "./entities/Restaurant";
import { WeekDay } from "./entities/WeekDay";

export class InitializerService {

    get areas(): Area[] {

        const areas = [ new Area( AreaName.MALMO__VASTRA_HAMNEN ) ];

        return areas;
    }

    get dishLabels(): Label[] {

        const labels = [
            new Label( LabelName.ARABIC ),
            new Label( LabelName.BREAD ),
            new Label( LabelName.BREAKFAST ),
            new Label( LabelName.CAKE ),
            new Label( LabelName.COFFEE ),
            new Label( LabelName.DESSERT ),
            new Label( LabelName.DRINK ),
            new Label( LabelName.FALAFEL ),
            new Label( LabelName.FAST_FOOD ),
            new Label( LabelName.FISH_AND_SEAFOOD ),
            new Label( LabelName.GRATIN ),
            new Label( LabelName.HOTPOT ),
            new Label( LabelName.INDIAN ),
            new Label( LabelName.MAIN ),
            new Label( LabelName.MEAL_OF_THE_DAY ),
            new Label( LabelName.MEAT ),
            new Label( LabelName.PERSIAN ),
            new Label( LabelName.PIE ),
            new Label( LabelName.PIZZA ),
            new Label( LabelName.PLAIN ),
            new Label( LabelName.PORK ),
            new Label( LabelName.POULTRY ),
            new Label( LabelName.SALAD ),
            new Label( LabelName.SANDWICH ),
            new Label( LabelName.SMOOTHIE ),
            new Label( LabelName.SNACK ),
            new Label( LabelName.SNACKS ),
            new Label( LabelName.SOUP ),
            new Label( LabelName.STARTER ),
            new Label( LabelName.SUPPER ),
            new Label( LabelName.THAI ),
            new Label( LabelName.VEGETARIAN ),
        ];

        return labels;
    }

    get weekDays(): WeekDay[] {

        const weekDays = [
            new WeekDay( WeekDayJavascriptDayIndex.MONDAY ),
            new WeekDay( WeekDayJavascriptDayIndex.TUESDAY ),
            new WeekDay( WeekDayJavascriptDayIndex.WEDNESDAY ),
            new WeekDay( WeekDayJavascriptDayIndex.THURSDAY ),
            new WeekDay( WeekDayJavascriptDayIndex.FRIDAY ),

            new WeekDay( WeekDayJavascriptDayIndex.SATURDAY ),
            new WeekDay( WeekDayJavascriptDayIndex.SUNDAY ),
         ];

        return weekDays;
    }
    public async initializeAndSetupDb(): Promise<void> {

        const dbManager = getConnection().manager;

        const areaSaves = this.areas.map(
            (a) => dbManager.save(a) );

        const dishLabelSaves = this.dishLabels.map(
            (dLS) => dbManager.save(dLS) );

        const weekDaySaves = this.weekDays.map(
                (wD) => dbManager.save(wD) );

        try {
            await Promise.all(areaSaves);
            await Promise.all(dishLabelSaves);
            await Promise.all(weekDaySaves);

            await this.createRestaurants();

        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
    }

    private async createRestaurants(): Promise<void> {
        const ACTIVE = true;

        const dbManager = getConnection().manager;
        const vastraHamnen = await dbManager
            .getRepository(Area)
            .findOne({ where: {name: AreaName.MALMO__VASTRA_HAMNEN} });
        const restaurants = [
            new Restaurant( "Kolga", "KolgaDealer", "https://kolga.gastrogate.com/lunch/", ACTIVE, "55.612298", "12.998472", vastraHamnen ),
            new Restaurant( "Miamarias", "MiamariasDealer", "http://www.miamarias.nu/", ACTIVE, "55.613649", "12.991565", vastraHamnen ),
            new Restaurant( "Glasklart", "GlasklartDealer", "https://glasklart.eu/sv/lunch/", ACTIVE, "55.615981", "12.990736", vastraHamnen ),
            new Restaurant( "Zen Thai", "ZenThaiDealer", "http://www.zenthai.se/", ACTIVE, "55.614280", "12.989225", vastraHamnen ),
        ];

        const restaurantSaves = restaurants.map(
            (r) => dbManager.save(r) );

        await Promise.all(restaurantSaves);
    }

}
