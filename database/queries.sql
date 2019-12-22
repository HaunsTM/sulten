USE `dbSulten`;

DROP PROCEDURE IF EXISTS getAlternativeId;
DROP PROCEDURE IF EXISTS getWeekDayId;
DROP PROCEDURE IF EXISTS getWeekIndexId;
DROP PROCEDURE IF EXISTS getOccurenceId;
DROP PROCEDURE IF EXISTS getRestaurantId;
DROP PROCEDURE IF EXISTS getPriceId;
DROP PROCEDURE IF EXISTS getLabelId;
DROP PROCEDURE IF EXISTS getLabelAlternativeId;
DROP PROCEDURE IF EXISTS getDishId;
DROP PROCEDURE IF EXISTS deletePossibleOldMeal;
DROP PROCEDURE IF EXISTS createAndGetMealId;


DELIMITER $$
CREATE PROCEDURE getAlternativeId (
	IN pIndex					    		INT,
	OUT idOut 								INT)
BEGIN

	SET @pIndex = pIndex;

	INSERT INTO alternatives(`index`) VALUES (@pIndex) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLabelAlternativeId (
	IN pFKLabelId					    	INT,
	IN pFKAlternativeId			    		INT,
	OUT idOut 								INT)
BEGIN

	SET @pFKLabelId = pFKLabelId;
	SET @pFKAlternativeId = pFKAlternativeId;

	INSERT INTO labelsAlternatives(`fKLabelId`,`fKAlternativeId`) VALUES (@pFKLabelId, @pFKAlternativeId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
		
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getWeekDayId (
	IN pJavaScriptDayIndex		    	INT,
	OUT idOut 								INT)
BEGIN

	SET @pJavaScriptDayIndex = pJavaScriptDayIndex;

	INSERT INTO weekDays(`javaScriptDayIndex`) VALUES (@pJavaScriptDayIndex) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
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
CREATE PROCEDURE getDishId (
	IN pDescription				    	    VARCHAR(255),
	IN pLabelId								INT,
	OUT idOut 								INT)
BEGIN

	SET @pDescription = pDescription;
	SET @pLabelId = pLabelId;

	INSERT INTO dishes(`description`, `fKLabelId`) VALUES (@pDescription, @pLabelId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE deletePossibleOldMeal (
	IN pWeekDay_JavaScriptDayIndex  	    INT,
	IN pWeekIndex_WeekNumber	    	    INT,
	IN pWeekIndex_WeekYear          	    INT,
	IN pRestaurant_MenuUrl          	    VARCHAR(255),
	IN pPrice_SEK                   	    DECIMAL(6, 2),
	IN pLabel_Name                  	    VARCHAR(255),    
	IN pAlternative_Index					INT)
BEGIN

    SET @pWeekDay_JavaScriptDayIndex = pWeekDay_JavaScriptDayIndex;
    SET @pWeekIndex_WeekNumber = pWeekIndex_WeekNumber;
    SET @pWeekIndex_WeekYear = pWeekIndex_WeekYear;
    SET @pRestaurant_MenuUrl = pRestaurant_MenuUrl;
    SET @pPrice_SEK = pPrice_SEK;
    SET @pLabel_Name = pLabel_Name;
    SET @pAlternative_Index = pAlternative_Index;

	DELETE m
	FROM meals AS m
		JOIN dishes
			on dishes.id =  m.fKDishId
			JOIN labels
				on labels.id = dishes.fKLabelId

	            JOIN labelsAlternatives	
                    on labelsAlternatives.fKLabelId = labels.id
	            JOIN alternatives
                    on alternatives.id = labelsAlternatives.fKAlternativeId	

		JOIN prices
			on prices.id =  m.fKPriceId
		JOIN restaurants
			on restaurants.id =  m.fKRestaurantId
		JOIN occurrences
			on occurrences.id =  m.fKOccurrenceId
			JOIN weekIndexes
				on weekIndexes.id = occurrences.fKWeekIndexId
			JOIN weekDays
				on weekDays.id = occurrences.fKWeekDayId
	WHERE		
		restaurants.menuUrl = @pRestaurant_MenuUrl AND 
		labels.name = @pLabel_Name AND         
		alternatives.index = @pAlternative_Index AND 
		prices.sek = @pPrice_SEK AND 
		weekDays.javaScriptDayIndex = @pWeekDay_JavaScriptDayIndex AND 
		weekIndexes.weekNumber = @pWeekIndex_WeekNumber AND 
		weekIndexes.weekYear = @pWeekIndex_WeekYear;

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
	IN pAlternative_Index					INT,
    IN pDish_Description          	        VARCHAR(255),
    IN pMeal_Error	                	    VARCHAR(255),
	OUT idOut 								INT)
BEGIN

    SET @pWeekDay_JavaScriptDayIndex = pWeekDay_JavaScriptDayIndex;
    SET @pWeekIndex_WeekNumber = pWeekIndex_WeekNumber;
    SET @pWeekIndex_WeekYear = pWeekIndex_WeekYear;
    SET @pRestaurant_MenuUrl = pRestaurant_MenuUrl;
    SET @pPrice_SEK = pPrice_SEK;
    SET @pLabel_Name = pLabel_Name;
	SET @pAlternative_Index = pAlternative_Index;
    SET @pDish_Description = pDish_Description;
    SET @pMeal_Error = pMeal_Error;

	CALL getWeekDayId(@pWeekDay_JavaScriptDayIndex, @WeekDayId);
	CALL getWeekIndexId(@pWeekIndex_WeekNumber, @pWeekIndex_WeekYear, @WeekIndexId);
	CALL getOccurenceId(@WeekIndexId, @WeekDayId, @OccurenceId);
	CALL getRestaurantId(@pRestaurant_MenuUrl, @RestaurantId);
	CALL getPriceId(@pPrice_SEK, @PriceId);    
	CALL getLabelId(@pLabel_Name, @LabelId);
	CALL getAlternativeId(@pAlternative_Index, @AlternativeId);	
	CALL getLabelAlternativeId(@LabelId, @AlternativeId, @LabelAlternativeId);
	CALL getDishId(@pDish_Description, @LabelId, @DishId);
    CALL deletePossibleOldMeal(@pWeekDay_JavaScriptDayIndex, @pWeekIndex_WeekNumber, @pWeekIndex_WeekYear, @pRestaurant_MenuUrl, @pPrice_SEK, @pLabel_Name, @pAlternative_Index);

	INSERT INTO meals(`fKDishId`, `fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `error`) 
        VALUES (@DishId, @PriceId, @OccurenceId, @RestaurantId, @pMeal_Error) 
    ON DUPLICATE KEY UPDATE `Error` = @pMeal_Error, `id` = LAST_INSERT_ID(`id`);

	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;