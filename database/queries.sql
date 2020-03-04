USE `dbSulten`;

DROP PROCEDURE IF EXISTS debug_msg;

DROP PROCEDURE IF EXISTS getWeekDayId;
DROP PROCEDURE IF EXISTS getWeekIndexId;
DROP PROCEDURE IF EXISTS getOccurenceId;
DROP PROCEDURE IF EXISTS getRestaurantId;
DROP PROCEDURE IF EXISTS getPriceId;
DROP PROCEDURE IF EXISTS getLabelId;
DROP PROCEDURE IF EXISTS getDishId;
DROP PROCEDURE IF EXISTS getIndexId;
DROP PROCEDURE IF EXISTS getAlternativeId;
DROP PROCEDURE IF EXISTS getAlternativeMealId;
DROP PROCEDURE IF EXISTS getPossibleOldDishDescriptionAndMealsId;
DROP PROCEDURE IF EXISTS deletePossibleOldMeal;
DROP PROCEDURE IF EXISTS createAndGetMealId;

DELIMITER $$
CREATE PROCEDURE debug_msg(variableName TEXT, variableValue TEXT)
BEGIN
    SELECT CONCAT('** ', variableName, ' = ', variableValue) AS '** DEBUG:';
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getWeekDayId (
	IN pDayIndex		    	            INT,
	OUT idOut 								INT)
BEGIN

	SET @pDayIndex = pDayIndex;

	INSERT INTO weekDays(`dayIndex`) VALUES (@pDayIndex) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getWeekIndexId (
	IN pWeekNumber				    		INT,
	IN pWeekYear							INT,
	OUT idOut 								INT)
BEGIN

	SET @pWeekNumber = pWeekNumber;
	SET @pWeekYear = pWeekYear;

	INSERT INTO weekIndexes(`weekNumber`,`weekYear`) VALUES (@pWeekNumber, @pWeekYear) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getOccurenceId (
	IN pWeekIndexId				    	    INT,
	IN pWeekDayId				    		INT,
	OUT idOut 								INT)
BEGIN

	SET @pWeekIndexId = pWeekIndexId;
	SET @pWeekDayId = pWeekDayId;

	INSERT INTO occurrences(`fKWeekIndexId`,`fKWeekDayId`) VALUES (@pWeekIndexId, @pWeekDayId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getRestaurantId (
	IN pMenuUrl					    		VARCHAR(255),
	OUT idOut 								INT)
BEGIN

	SET @pMenuUrl = pMenuUrl;

	SET idOut = (SELECT `id` FROM restaurants WHERE `menuUrl` = @pMenuUrl LIMIT 1);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getPriceId (
	IN pSEK						    		DECIMAL(6, 2),
	OUT idOut 								INT)
BEGIN

	SET @pSEK = pSEK;

    INSERT INTO prices(`sek`) VALUES (@pSEK) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
        
    SELECT LAST_INSERT_ID() INTO idOut;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getDishId (
	IN pDescription				    	    VARCHAR(255),
	OUT idOut 								INT)
BEGIN

	SET @pDescription = pDescription;

    INSERT INTO dishes(`description`) VALUES (@pDescription) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
    SELECT LAST_INSERT_ID() INTO idOut;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getIndexId (
	IN pNumber				    	        INT,
	OUT idOut 								INT)
BEGIN

	SET @pNumber = pNumber;

    INSERT INTO indexes(`number`) VALUES (@pNumber) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
    SELECT LAST_INSERT_ID() INTO idOut;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLabelId (
	IN pName					    		VARCHAR(255),
	OUT idOut 								INT)
BEGIN

	SET @pName = pName;

	INSERT INTO labels(`name`) VALUES (@pName) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getAlternativeId (
	IN pDishId				    	        INT,
	IN pIndexId		    		            INT,
	IN pLabelId				    	        INT,
	OUT idOut 								INT)
BEGIN

	SET @pDishId = pDishId;
	SET @pIndexId = pIndexId;
	SET @pLabelId = pLabelId;

	INSERT INTO alternatives(`fKDishId`, `fKIndexId`, `fKLabelId`) VALUES (@pDishId, @pIndexId, @pLabelId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getAlternativeMealId (
    IN pAlternativeId				    	INT,
	IN pMealId		    		            INT,
	OUT idOut 								INT)
BEGIN

	SET @pAlternativeId = pAlternativeId;
	SET @pMealId = pMealId;

	INSERT INTO alternativesMeals(`fKAlternativeId`, `fKMealId`) VALUES (@pAlternativeId, @pMealId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE deletePossibleOldMeal (
	IN pOccurences_Id                       INT,
	IN pRestaurant_Id                       INT,
	IN pIndexId                 	        INT,
	IN pLabelId                 	        INT)
BEGIN

    SET @pOccurences_Id = pOccurences_Id;
    SET @pRestaurant_Id = pRestaurant_Id;
    SET @pIndexId = pIndexId;
    SET @pLabelId = pLabelId;


    DELETE FROM meals where meals.id IN 
        (SELECT meals.id
        FROM alternativesMeals
            JOIN alternatives
                on alternatives.id = alternativesMeals.fKAlternativeId
                    JOIN indexes
                        on indexes.id = alternatives.fKIndexId
                    JOIN labels
                        on labels.id = alternatives.fKLabelId
            JOIN meals
                on meals.id = alternativesMeals.fKMealId
                    JOIN restaurants
                        on restaurants.id =  meals.fKRestaurantId
                    JOIN occurrences
                        on occurrences.id = meals.fKOccurrenceId
        WHERE
            indexes.id = @pIndexId AND
            labels.id = @pLabelId AND
            restaurants.id = @pRestaurant_Id AND
            occurrences.id = @pOccurences_Id);


    
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getPossibleOldDishDescriptionAndMealsId (
	IN pOccurences_Id                       INT,
	IN pRestaurant_Id                       INT,
	IN pIndexId                 	        INT,
	IN pLabelId                 	        INT,
	OUT dishDescription                     TEXT,
	OUT mealsId                             INT)
BEGIN

    SET @pOccurences_Id = pOccurences_Id;
    SET @pRestaurant_Id = pRestaurant_Id;
    SET @pIndexId = pIndexId;
    SET @pLabelId = pLabelId;

    SELECT dishes.description, meals.id
        INTO dishDescription, mealsId
    FROM alternativesMeals
        JOIN alternatives
            on alternatives.id = alternativesMeals.fKAlternativeId
                JOIN indexes
                    on indexes.id = alternatives.fKIndexId
                JOIN labels
                    on labels.id = alternatives.fKLabelId
                JOIN dishes
                    on dishes.id = alternatives.fKDishId
        JOIN meals
            on meals.id = alternativesMeals.fKMealId
                JOIN restaurants
                    on restaurants.id =  meals.fKRestaurantId
                JOIN occurrences
                    on occurrences.id = meals.fKOccurrenceId
    WHERE
        indexes.id = @pIndexId AND
        labels.id = @pLabelId AND
        restaurants.id = @pRestaurant_Id AND
        occurrences.id = @pOccurences_Id
    LIMIT 1;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE createAndGetMealId (
	IN pCurrentWeekDay_DayIndex  	            INT,
	IN pCurrentWeekIndex_WeekNumber	    	    INT,
	IN pCurrentWeekIndex_WeekYear          	    INT,
	IN pCurrentRestaurant_MenuUrl          	    VARCHAR(255),
	IN pCurrentPrice_SEK                   	    DECIMAL(6, 2),
	IN pCurrentLabel_Name                  	    VARCHAR(255),
	IN pCurrentIndex_Number				        INT,
    IN pCurrentDish_Description                 VARCHAR(255),
    IN pCurrentDish_LastUpdatedUTC         	    TIMESTAMP,
    IN pCurrentMeal_Error                       TEXT)
BEGIN

    SET @pCurrentWeekDay_DayIndex = pCurrentWeekDay_DayIndex;
    SET @pCurrentWeekIndex_WeekNumber = pCurrentWeekIndex_WeekNumber;
    SET @pCurrentWeekIndex_WeekYear = pCurrentWeekIndex_WeekYear;
    SET @pCurrentRestaurant_MenuUrl = pCurrentRestaurant_MenuUrl;
    SET @pCurrentPrice_SEK = pCurrentPrice_SEK;
    SET @pCurrentLabel_Name = pCurrentLabel_Name;
	SET @pCurrentIndex_Number = pCurrentIndex_Number;
    SET @pCurrentDish_Description = pCurrentDish_Description;
    SET @pCurrentDish_LastUpdatedUTC = pCurrentDish_LastUpdatedUTC;    
    SET @pCurrentMeal_Error = pCurrentMeal_Error;

	CALL getWeekDayId(@pCurrentWeekDay_DayIndex, @WeekDayId);    

	CALL getWeekIndexId(@pCurrentWeekIndex_WeekNumber, @pCurrentWeekIndex_WeekYear, @WeekIndexId);
	CALL getOccurenceId(@WeekIndexId, @WeekDayId, @OccurenceId);
	
	CALL getRestaurantId(@pCurrentRestaurant_MenuUrl, @RestaurantId);
	
	CALL getPriceId(@pCurrentPrice_SEK, @PriceId);
	
	CALL getDishId(@pCurrentDish_Description, @DishId);
	
	CALL getIndexId(@pCurrentIndex_Number, @IndexId);
	
	CALL getLabelId(@pCurrentLabel_Name, @LabelId);
    
	CALL getAlternativeId(@DishId, @IndexId, @LabelId, @AlternativeId);


    IF @pCurrentMeal_Error IS NULL OR @pCurrentMeal_Error = '' THEN
        -- input data did not contain any arror
		
	    CALL deletePossibleOldMeal(@OccurenceId, @RestaurantId, @IndexId, @LabelId);
        
        INSERT INTO meals(`fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `lastUpdatedUTC`, `error`) 
            VALUES (@PriceId, @OccurenceId, @RestaurantId, @CurrentDish_LastUpdatedUTC, NULL)
            ON DUPLICATE KEY UPDATE `lastUpdatedUTC` = @pDish_LastUpdatedUTC, `id` = LAST_INSERT_ID(`id`);
        
        SELECT LAST_INSERT_ID() INTO @MealId;
        
        CALL getAlternativeMealId(@AlternativeId, @MealId, @AlternativeMealId);
        
        SELECT @MealId;

    ELSE
        -- input data contained error

        CALL getPossibleOldDishDescriptionAndMealsId(
            @OccurenceId, @RestaurantId, @IndexId, @LabelId, @PossibleOldDishDescription, @PossibleOldMealId);

        IF @PossibleOldDishDescription != '' THEN
            -- an earlier dish description existed, don't take note of any new errors            
            SELECT @PossibleOldMealId;
        ELSE
            -- an earlier dish description did not exist
	        CALL deletePossibleOldMeal(@OccurenceId, @RestaurantId, @IndexId, @LabelId);

            INSERT INTO meals(`fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `lastUpdatedUTC`, `error`) 
                VALUES (@PriceId, @OccurenceId, @RestaurantId, @CurrentDish_LastUpdatedUTC, @pCurrentMeal_Error)
                ON DUPLICATE KEY UPDATE `lastUpdatedUTC` = @pDish_LastUpdatedUTC, `id` = LAST_INSERT_ID(`id`);
            
            SELECT LAST_INSERT_ID() INTO @MealId;
            
            CALL getAlternativeMealId(@AlternativeId, @MealId, @AlternativeMealId);
            
            SELECT @MealId;
        END IF;
    END IF;

END$$
DELIMITER ;

 -- UPDATE `restaurants` SET `active` = 0;
 -- UPDATE `restaurants` SET `active` = 1 WHERE `menuUrl` = "https://restaurangkolga.se/lunch/";
