# Set up database on development computer

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [MariaDB](https://mariadb.org/download/) on your computer
1. Setup MariaDb by running: `sudo mysql_secure_installation` (set password to root)
1. Login to MariaDb: `sudo mariadb -u root -p`
1. Create a database `CREATE DATABASE dbSulten;` _(obsolete: this is included in `create_dbSulten_scripts.sql`)_
1. Write `use sultenDb;` _(obsolete: this is included in `create_dbSulten_scripts.sql`)_
1. Run `source /absolute/location/sulten/database/create_dbSulten_scripts.sql`
1. Run `source /absolute/location/sulten/database/queries.sql`
1. Run `source /absolute/location/sulten/database/initialData.sql`
1. See bunch of rows being created.
1. Exit.

# Dependencies

1. run `yarn` to install dependencies
1. start development server `yarn dev`

# Start
The first thing you have to do is to populate the database with actual restaurant data (_i.e_ menus). This is done by hitting the endpoint `/admin/fetchMenusForAllAreas/:weekIndex`, _example:_  http://localhost:8080/admin/fetchMenusForAllAreas/49.

**Please be aware that SOME restaurants removes content successively during a week = the content changes.**

By convention, the sulten logic is adapted to full menus. Most likely, the best time for fetching full menus is at mondays (it seems that most of the current menus are published by then).

# Available endpoints

- /admin/fetchMenusForAllAreas/:weekIndex
- /admin/fetchMenusForArea/:id

# Set up database on development computer

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [MariaDB](https://mariadb.org/download/) on your computer
1. Setup MariaDb by running: `sudo mysql_secure_installation` (set password to root)
1. Login to MariaDb: `sudo mariadb -u root -p`
1. Create a database `CREATE DATABASE dbSulten;` _(obsolete: this is included in `create_dbSulten_scripts.sql`)_
1. Write `use sultenDb;` _(obsolete: this is included in `create_dbSulten_scripts.sql`)_
1. Run `source /absolute/location/sulten/database/create_dbSulten_scripts.sql`
1. Run `source /absolute/location/sulten/database/queries.sql`
1. Run `source /absolute/location/sulten/database/initialData.sql`
1. See bunch of rows being created.
1. Exit.

# Dependencies

1. run `yarn` to install dependencies
1. start development server `yarn dev`

# Start
The first thing you have to do is to populate the database with actual restaurant data (_i.e_ menus). This is done by hitting the endpoint `/admin/fetchMenusForAllAreas/:weekIndex`, _example:_  http://localhost:8080/admin/fetchMenusForAllAreas/49.

**Please be aware that SOME restaurants removes content successively during a week = the content changes.**

By convention, the sulten logic is adapted to full menus. Most likely, the best time for fetching full menus is at mondays (it seems that most of the current menus are published by then).

# Available endpoints

http://localhost:8080/
- /admin/fetchMenusForAllAreas/:weekIndex
- /admin/fetchMenusForArea/:id

http://localhost:8080/ or https://api.sulten.se
- /menu/allAreas
- /menu/mealsPerAreaWeekYear/:areaId/:weekNumber/:weekYear
- /menu/mealsPerAreaDayWeekYear/:areaId/:javaScriptDayIndex/:weekNumber/:weekYear
- /restaurantsPerArea/:areaId

## Examples:

http://localhost:8080/menu/mealsPerAreaWeekYear/2/51/2019

<pre>[
    {
        "restaurantName": "Restaurang Variation",
        "restaurantMenuUrl": "https://www.nyavariation.se/matsedel/",
        "alternativeLabelDishPrices": [
            {
                "indexNumber": 1,
                "labelName": "meal_of_the_day",
                "dishDescription": "Helstekt fläskytterfilé med glöggkokta sviskon, gräddsås och kokt potatis",
                "dayIndex": 1,
                "priceSEK": "99.00"
            },
            {
                "indexNumber": 2,
                "labelName": "meal_of_the_day",
                "dishDescription": "Husets paella serveras med vitlöksyoghurt",
                "dayIndex": 3,
                "priceSEK": "99.00"
            },
            {
                "indexNumber": 1,
                "labelName": "salad",
                "dishDescription": "Potatis- och purjolökssoppa",
                "dayIndex": 3,
                "priceSEK": "75.00"
            },
        ]
    },
]</pre>

http://localhost:8080/menu/mealsPerAreaDayWeekYear/2/4/47/2019

<pre>[
    {
        "dayIndex": 4,
        "restaurantName": "Lokal 17",
        "restaurantMenuUrl": "https://lokal17.se/",
        "alternativeLabelDishPrices": [
            {
                "indexNumber": 1,
                "labelName": "meal_of_the_day",
                "dishDescription": "Gris-mandel-äpple-silverlök",
                "priceSEK": "123.00"
            },
            {
                "indexNumber": 1,
                "labelName": "vegetarian",
                "dishDescription": "Jordärtsskocka-linser-tryffel-svamp",
                "priceSEK": "123.00"
            },
            {
                "indexNumber": 1,
                "labelName": "dessert",
                "dishDescription": "En kula glass med salt kola & crisp",
                "priceSEK": "25.00"
            },
            {
                "indexNumber": 2,
                "labelName": "dessert",
                "dishDescription": "Choklad tryffel",
                "priceSEK": "25.00"
            }
        ]
    },
    {
        "dayIndex": 4,
        "restaurantName": "Restaurang Variation",
        "restaurantMenuUrl": "https://www.nyavariation.se/matsedel/",
        "alternativeLabelDishPrices": [
            {
                "indexNumber": 1,
                "labelName": "meal_of_the_day",
                "dishDescription": "Pannbiff med lök, skysås, lingonsylt och kokt potatis",
                "priceSEK": "99.00"
            },
            {
                "indexNumber": 2,
                "labelName": "meal_of_the_day",
                "dishDescription": "Ärtsoppa med fläskkorv och rökt fläsksida",
                "priceSEK": "99.00"
            },
            {
                "indexNumber": 1,
                "labelName": "vegetarian",
                "dishDescription": "Bönbiffar serveras med vitlöksyoghurt",
                "priceSEK": "75.00"
            },
            {
                "indexNumber": 1,
                "labelName": "salad",
                "dishDescription": "Potatis- och purjolökssoppa",
                "priceSEK": "75.00"
            }
        ]
    },
]</pre>

http://localhost:8080/menu/allAreas

<pre>[
    {
        "id": 3,
        "name": "Lund - Brunnshög"
    },
    {
        "id": 4,
        "name": "Lund - Sjukhuset"
    },
    {
        "id": 1,
        "name": "Malmö - Centrum"
    },
    {
        "id": 2,
        "name": "Malmö - Västra Hamnen"
    }
]</pre>

http://api.sulten.se/restaurantsPerArea/3

<pre>{
    "area": {
        "id": 3,
        "name": "Lund - Brunnshög"
    },
    "restaurants": [
        {
            "id": 1,
            "active": true,
            "name": "Bricks Eatery",
            "menuUrl": "https://brickseatery.se/lunch/",
            "longitude": "55.71650200",
            "latitude": "13.22682000"
        }
    ]
}</pre>

## LabelName
Dishes are categorized with different labels. Althought labels is text, some has been predefined in `server/enum/LabelName.ts` as enums for simpler usage.

Here are some examples:
<pre>export enum LabelName {
    BARBACUE = "barbacue",
    DESSERT = "dessert",
    INDIAN = "indian",
    MEAL_OF_THE_DAY = "meal_of_the_day",
    PIZZA = "pizza",
    SOUP = "soup",
    THAI = "thai",
    VEGETARIAN = "vegetarian",
}</pre>
