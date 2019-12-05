# Set up database on development computer

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [MariaDB](https://mariadb.org/download/) on your computer
1. Setup MariaDb by running: `sudo mysql_secure_installation` (set password to root)
1. Login to MariaDb: `sudo mariadb -u root -p`
1. Create a database `CREATE DATABASE dbSulten;`
1. Write `use sultenDb;`
1. Run `source /absolute/location/sulten/database/create_dbSulten_scripts.sql`
1. Run `source /absolute/location/sulten/database/queries.sql`
1. Run `source /absolute/location/sulten/database/initialData.sql`
1. See bunch of rows being created.
1. Exit.

# Dependencies

1. run `yarn` to install dependencies
1. start development server `yarn dev`

# Available endpoints

- /admin/fetchMenusForAllAreas/:weekIndex
- /admin/fetchMenusForArea/:id

- /menu/getAllAreas
- /menu/getMealsPerAreaAndWeekAndYear/:areaId/:weekNumber/:weekYear
- /menu/getMealsPerAreaAndDayAndWeekAndYear/:areaId/:javaScriptDayIndex/:weekNumber/:weekYear

## Examples:

http://localhost:8080/menu/getMealsPerAreaAndWeekAndYear/1/47/2019

<pre>[
    {
        "restaurantName": "Kolga",
        "labelDishPrices": [
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Spagetti Carbonara med riven ost",
                "javaScriptDayIndex": 1,
                "priceSEK": "95.00"
            },
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Ärtsoppa eller Fisksoppa, pannkakor med sylt och grädde",
                "javaScriptDayIndex": 4,
                "priceSEK": "85.00"
            },
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Raggmunkar med stekt bacon och lingon",
                "javaScriptDayIndex": 4,
                "priceSEK": "95.00"
            }
        ]
    }
]</pre>

http://localhost:8080/menu/getMealsPerAreaAndDayAndWeekAndYear/1/4/47/2019

<pre>[
    {
        "javaScriptDayIndex": 4,
        "restaurantName": "Kolga",
        "labelDishPrices": [
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Ärtsoppa eller Fisksoppa, pannkakor med sylt och grädde",
                "priceSEK": "85.00"
            },
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Raggmunkar med stekt bacon och lingon",
                "priceSEK": "95.00"
            }
        ]
    },
    {
        "javaScriptDayIndex": 4,
        "restaurantName": "Miamarias",
        "labelDishPrices": [
            {
                "labelName": "fish_and_seafood",
                "dishDescription": "Citrusöverbakad kummel med soja- och ingefärssmör, savojkål.",
                "priceSEK": "110.00"
            },
            {
                "labelName": "meat",
                "dishDescription": "Dillkött. Kokt kalvkött i sötsyrlig dillsås, picklad morot, kokt potatis och pepparrotskräm.",
                "priceSEK": "95.00"
            },
            {
                "labelName": "vegetarian",
                "DishDescription": "Tagliatelle med valnötspesto, mozzarella och rostad tomat.",
                "priceSEK": "90.00"
            }
        ]
    },
    {
        "javaScriptDayIndex": 4,
        "restaurantName": "Glasklart",
        "labelDishPrices": [
            {
                "labelName": "meal_of_the_day",
                "dishDescription": "Raggmunk med fläsk och rårörda lingon alt. Bruna bönor med fläsk",
                "priceSEK": "100.00"
            },
            {
                "labelName": "vegetarian",
                "dishDescription": "Rödbetsbiffar med smörstekt savoykål, rostad potatis och fetaostcreme",
                "priceSEK": "100.00"
            }
        ]
    }
]</pre>

http://localhost:8080/menu/getAllAreas

<pre>[
    {
        "name": "Malmö - Västra Hamnen",
        "id": 1
    }
]</pre>
