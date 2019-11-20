# Set up database on development computer

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [MariaDB](https://mariadb.org/download/) on your computer
1. MANUALLY create a database named `dbSulten`
1. run the scripts found in `./database`
* `./database/create_dbSulten_scripts.sql`
* `./database/queries.sql`
1. run `yarn` to install dependencies
1. start development server `yarn run dev`
1. when you have got your server up and running (`App listening on the port 8080`), go to this endpoint once (*O-N-C-E*): `http://localhost:8080/admin/initializeAndSetupDb`

# Available endpoints

+ /admin/initializeAndSetupDb
+ /admin/fetchMenusForAllAreas/:weekIndex
+ /admin/fetchMenusForArea/:id

+ /menu/getAllAreas
+ /menu/getMealsPerAreaAndWeekAndYear/:areaId/:weekNumber/:weekYear
+ /menu/getMealsPerAreaAndDayAndWeekAndYear/:areaId/:javaScriptDayIndex/:weekNumber/:weekYear

## Examples:
http://localhost:8080/menu/getMealsPerAreaAndWeekAndYear/1/47/2019
<pre>[
    {
        "RestaurantName": "Kolga",
        "LabelDishPrices": [
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Spagetti Carbonara med riven ost",
                "JavaScriptDayIndex": 1,
                "PriceSEK": "95.00"
            },
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Ärtsoppa eller Fisksoppa, pannkakor med sylt och grädde",
                "JavaScriptDayIndex": 4,
                "PriceSEK": "85.00"
            },
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Raggmunkar med stekt bacon och lingon",
                "JavaScriptDayIndex": 4,
                "PriceSEK": "95.00"
            }
        ]
    }
]</pre>

http://localhost:8080/menu/getAllAreas
<pre>[
    {
        "Name": "Malmö - Västra Hamnen",
        "Id": 1
    }
]</pre>
