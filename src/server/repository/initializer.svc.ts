import { getConnection } from "typeorm";
import { AreaName } from "../enum/AreaName";
import { LabelName } from "../enum/LabelName";
import { WeekDayJavascriptDayIndex } from "../enum/WeekDayJavascriptDayIndex";
import { Area } from "./entities/Area";
import { Label } from "./entities/Label";
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

        } catch (e) {
            throw new Error(`Couldn't initialize database: ${e}`);
        }
/*
        await getManager().transaction(async (transactionalEntityManager) => {

            const areaSaves = this.areas.map(
                (a) => transactionalEntityManager.save(a) );

            const dishLabelSaves = this.dishLabels.map(
                (dLS) => transactionalEntityManager.save(dLS) );

            const weekDaySaves = this.weekDays.map(
                    (wD) => transactionalEntityManager.save(wD) );

            try {
                await Promise.all(areaSaves);
                await Promise.all(dishLabelSaves);
                await Promise.all(weekDaySaves);

            } catch (e) {
                throw new Error(`Couldn't initialize database: ${e}`);
            }

        });
*/
    }

    /**
BEGIN TRANSACTION;
	DROP TABLE IF EXISTS _Variables;
	CREATE TEMP TABLE _Variables (name TEXT PRIMARY KEY, value TEXT);

	-- week_day
	INSERT INTO _Variables(name, value) VALUES ("weekDayId", (SELECT id FROM week_day WHERE week_day.javascriptDayIndex = 4 LIMIT 1));	
	
	-- week_index
	INSERT INTO week_index(weekNumber, weekYear) VALUES (45,2019)
		ON CONFLICT(weekNumber, weekYear) DO UPDATE SET
		weekNumber=excluded.weekNumber,
		weekYear=excluded.weekYear;	
	INSERT INTO _Variables(name, value) VALUES (
		"weekIndexId", 
		(SELECT id FROM week_index WHERE week_index.weekNumber = 45 AND week_index.weekYear = 2019 LIMIT 1)
	);

	-- occurence
	INSERT INTO occurence(weekDayId, weekIndexId) VALUES (
		(SELECT value FROM _Variables WHERE name="weekDayId" LIMIT 1),
		(SELECT value FROM _Variables WHERE name="weekIndexId" LIMIT 1)
	) ON CONFLICT(weekDayId, weekIndexId) DO 
		UPDATE SET
		weekDayId=excluded.weekDayId,
		weekIndexId=excluded.weekIndexId;	
	INSERT INTO _Variables(name, value) VALUES (
		"occurenceId", (
		SELECT id FROM occurence 
			WHERE occurence.weekDayId = (SELECT value FROM _Variables WHERE name="weekDayId" LIMIT 1) AND 
			occurence.weekIndexId = (SELECT value FROM _Variables WHERE name="weekIndexId" LIMIT 1) LIMIT 1
		)
	);
	
	-- label
	INSERT INTO _Variables(name, value) VALUES ("labelId", (SELECT id FROM label WHERE label.name = "dessert" LIMIT 1));
	
	-- dish
	INSERT INTO dish(description, priceSEK, labelId) VALUES ("Köttfärsfylld paprika med tofu och lunga", "75", (SELECT value FROM _Variables WHERE name="labelId" LIMIT 1))
		ON CONFLICT(description) DO UPDATE SET
		description=excluded.description,
		priceSEK=excluded.priceSEK,
		labelId=excluded.labelId;		
	INSERT INTO _Variables(name, value) VALUES (
		"dishId", (
		SELECT id FROM dish 
			WHERE dish.description = "Köttfärsfylld paprika med tofu och lunga" AND 
			dish.priceSEK = "75" AND
			dish.labelId = (SELECT value FROM _Variables WHERE name="labelId" LIMIT 1) LIMIT 1
		)
	);
	
	-- area	
	INSERT INTO _Variables(name, value) VALUES ("areaId", (SELECT id FROM area WHERE area.name = "Malmö - Västra Hamnen" LIMIT 1));
	
	-- restaurant
	INSERT INTO restaurant(active, name, menuUrl) VALUES (1, "kolga", "https://kolga.gastrogate.com/lunch/1/")
		ON CONFLICT(menuUrl) DO UPDATE SET
		active=excluded.active,
		name=excluded.name,
		menuUrl=excluded.menuUrl;	
	INSERT INTO _Variables(name, value) VALUES (
		"restaurantId", (
		SELECT id FROM restaurant 
			WHERE restaurant.name = "kolga" AND
			restaurant.menuUrl = "https://kolga.gastrogate.com/lunch/1/" AND
			restaurant.active = 1 AND
			restaurant.areaId = (SELECT value FROM _Variables WHERE name="areaId" LIMIT 1) LIMIT 1
		)
	);
	
	-- meal
	INSERT INTO meal(dishId, occurenceId, restaurantId, error) VALUES (
		(SELECT value FROM _Variables WHERE name="dishId" LIMIT 1),
		(SELECT value FROM _Variables WHERE name="occurenceId" LIMIT 1),
		(SELECT value FROM _Variables WHERE name="restaurantId" LIMIT 1),
		"ftyj"
	)
		ON CONFLICT(dishId, occurenceId, restaurantId) DO UPDATE SET
		dishId=excluded.dishId,
		occurenceId=excluded.occurenceId,
		restaurantId=excluded.restaurantId;
	
	
	DROP TABLE IF EXISTS _Variables;

COMMIT;
     */

}
