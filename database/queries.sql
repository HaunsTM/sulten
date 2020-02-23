USE `dbSulten`;

DROP PROCEDURE IF EXISTS getWeekDayId;
DROP PROCEDURE IF EXISTS getWeekIndexId;
DROP PROCEDURE IF EXISTS getOccurenceId;
DROP PROCEDURE IF EXISTS getRestaurantId;
DROP PROCEDURE IF EXISTS getPriceIddbsulten;
DROP PROCEDURE IF EXISTS getLabelId;
DROP PROCEDURE IF EXISTS getDishId;
DROP PROCEDURE IF EXISTS getIndexId;
DROP PROCEDURE IF EXISTS getAlternativeId;
DROP PROCEDURE IF EXISTS getAlternativeMealId;
DROP PROCEDURE IF EXISTS deletePossibleOldMeal;
DROP PROCEDURE IF EXISTS createAndGetMealId;


DELIMITER $$
CREATE PROCEDURE getWeekDayId (
	IN pJavaScriptDayIndex		    	INT,
	OUT idOut 								INT)
BEGIN

	SET @pJavaScriptDayIndex = pJavaScriptDayIndex;

	INSERT INTO weekDays(`dayIndex`) VALUES (@pJavaScriptDayIndex) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
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
	IN pPrice_Id                  	        INT,
	IN pDish_Id                 	        INT,
	IN pIndexId                 	        INT,
	IN pLabelId                 	        INT)
BEGIN

    SET @pOccurences_Id = pOccurences_Id;
    SET @pRestaurant_Id = pRestaurant_Id;
    SET @pPrice_Id = pPrice_Id;

    SET @pDish_Id = pDish_Id;
    SET @pIndexId = pIndexId;
    SET @pLabelId = pLabelId;

	DELETE m
	FROM meals AS m
		JOIN prices
			on prices.id =  m.fKPriceId
		JOIN restaurants
			on restaurants.id =  m.fKRestaurantId
		JOIN occurrences
			on occurrences.id =  m.fKOccurrenceId
	WHERE		
		restaurants.id = @pRestaurant_Id AND
		prices.id = @pPrice_Id AND 
		occurrences.id = @pOccurences_Id AND
        m.id = (
            SELECT fKMealId
            FROM alternativesMeals 
                JOIN alternatives
                    on alternatives.id = alternativesMeals.fKAlternativeId
                    JOIN dishes
                        on alternatives.fKDishId = dishes.id
                    JOIN indexes
                        on alternatives.fKIndexId = indexes.id
                    JOIN labels
                        on alternatives.fKLabelId = labels.id
            WHERE
                dishes.id = @pDish_Id AND
                indexes.id = @pIndexId AND
                labels.id = @pLabelId        
        ) AND
        m.error <> '';
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE createAndGetMealId (
	IN pWeekDay_JavaScriptDayIndex  	    INT,
	IN pWeekIndex_WeekNumber	    	    INT,
	IN pWeekIndex_WeekYear          	    INT,
	IN pRestaurant_MenuUrl          	    VARCHAR(255),
	IN pPrice_SEK                   	    DECIMAL(6, 2),
	IN pLabel_Name                  	    VARCHAR(255),
	IN pIndex_Number				        INT,
    IN pDish_Description          	        VARCHAR(255),
    IN pDish_LastUpdatedUTC         	    TIMESTAMP,
    IN pMeal_Error	                	    TEXT)
BEGIN

    SET @pWeekDay_JavaScriptDayIndex = pWeekDay_JavaScriptDayIndex;
    SET @pWeekIndex_WeekNumber = pWeekIndex_WeekNumber;
    SET @pWeekIndex_WeekYear = pWeekIndex_WeekYear;
    SET @pRestaurant_MenuUrl = pRestaurant_MenuUrl;
    SET @pPrice_SEK = pPrice_SEK;
    SET @pLabel_Name = pLabel_Name;
	SET @pIndex_Number = pIndex_Number;
    SET @pDish_Description = pDish_Description;
    SET @pDish_LastUpdatedUTC = pDish_LastUpdatedUTC;    
    SET @pMeal_Error = pMeal_Error;

	CALL getWeekDayId(@pWeekDay_JavaScriptDayIndex, @WeekDayId);
	CALL getWeekIndexId(@pWeekIndex_WeekNumber, @pWeekIndex_WeekYear, @WeekIndexId);
	CALL getOccurenceId(@WeekIndexId, @WeekDayId, @OccurenceId);
	
	CALL getRestaurantId(@pRestaurant_MenuUrl, @RestaurantId);
	
	CALL getPriceId(@pPrice_SEK, @PriceId);
	
	CALL getDishId(@pDish_Description, @DishId);
	
	CALL getIndexId(@pIndex_Number, @IndexId);
	
	CALL getLabelId(@pLabel_Name, @LabelId);
	
	CALL getAlternativeId(@DishId, @IndexId, @LabelId, @AlternativeId);
	
	CALL deletePossibleOldMeal (@pOccurences_Id, @pRestaurant_Id, @pPrice_Id, @pDish_Id, @IndexId, @LabelId);    
	
	INSERT INTO meals(`fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `lastUpdatedUTC`, `error`) VALUES (@PriceId, @OccurenceId, @RestaurantId, @pDish_LastUpdatedUTC, @pMeal_Error)
		ON DUPLICATE KEY UPDATE `lastUpdatedUTC` = @pDish_LastUpdatedUTC, `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO @MealId;
	
	CALL getAlternativeMealId(@AlternativeId, @MealId, @AlternativeMealId);
	
	SELECT @MealId;

END$$
DELIMITER ;
