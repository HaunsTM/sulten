# Set up database on development computer

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [MariaDB](https://mariadb.org/download/) on your computer
1. Setup MariaDb by running: `sudo mysql_secure_installation` (set password to root)
1. Login to MariaDb: `sudo mariadb -u root -p`
1. Create a database `CREATE DATABASE dbSulten;`
1. Write `use sultenDb;`
1. Run `source /absolute/location/sulten/database/create_dbSulten_scripts.sql`
1. Run `source /absolute/location/sulten/database/queries.sql`
1. See bunch of rows being created.
1. Exit.

# Dependencies

1. run `yarn` to install dependencies
1. start development server `yarn dev`
1. when you have got your server up and running (`App listening on the port 8080`), go to this endpoint once (_O-N-C-E_): `http://localhost:8080/admin/initializeAndSetupDb`

# Available endpoints

- /admin/initializeAndSetupDb
- /admin/fetchMenusForAllAreas/:weekIndex
- /admin/fetchMenusForArea/:id

- /menu/getAllAreas
- /menu/getMealsPerAreaAndWeekAndYear/:areaId/:weekNumber/:weekYear
- /menu/getMealsPerAreaAndDayAndWeekAndYear/:areaId/:javaScriptDayIndex/:weekNumber/:weekYear

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

http://localhost:8080/menu/getMealsPerAreaAndDayAndWeekAndYear/1/4/47/2019

<pre>[
    {
        "JavaScriptDayIndex": 4,
        "RestaurantName": "Kolga",
        "LabelDishPrices": [
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Ärtsoppa eller Fisksoppa, pannkakor med sylt och grädde",
                "PriceSEK": "85.00"
            },
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Raggmunkar med stekt bacon och lingon",
                "PriceSEK": "95.00"
            }
        ]
    },
    {
        "JavaScriptDayIndex": 4,
        "RestaurantName": "Miamarias",
        "LabelDishPrices": [
            {
                "LabelName": "fish_and_seafood",
                "DishDescription": "Citrusöverbakad kummel med soja- och ingefärssmör, savojkål.",
                "PriceSEK": "110.00"
            },
            {
                "LabelName": "meat",
                "DishDescription": "Dillkött. Kokt kalvkött i sötsyrlig dillsås, picklad morot, kokt potatis och pepparrotskräm.",
                "PriceSEK": "95.00"
            },
            {
                "LabelName": "vegetarian",
                "DishDescription": "Tagliatelle med valnötspesto, mozzarella och rostad tomat.",
                "PriceSEK": "90.00"
            }
        ]
    },
    {
        "JavaScriptDayIndex": 4,
        "RestaurantName": "Glasklart",
        "LabelDishPrices": [
            {
                "LabelName": "meal_of_the_day",
                "DishDescription": "Raggmunk med fläsk och rårörda lingon alt. Bruna bönor med fläsk",
                "PriceSEK": "100.00"
            },
            {
                "LabelName": "vegetarian",
                "DishDescription": "Rödbetsbiffar med smörstekt savoykål, rostad potatis och fetaostcreme",
                "PriceSEK": "100.00"
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
