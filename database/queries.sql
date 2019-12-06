USE `dbSulten`;

DROP PROCEDURE IF EXISTS getWeekDayId;
DROP PROCEDURE IF EXISTS getWeekIndexId;
DROP PROCEDURE IF EXISTS getOccurenceId;
DROP PROCEDURE IF EXISTS getRestaurantId;
DROP PROCEDURE IF EXISTS getPriceId;
DROP PROCEDURE IF EXISTS getLabelId;
DROP PROCEDURE IF EXISTS getDishId;
DROP PROCEDURE IF EXISTS createAndGetMealId;

DELIMITER $$
CREATE PROCEDURE getWeekDayId (
	IN pJavaScriptDayIndex		    	INT,
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO weekdays(`javaScriptDayIndex`) VALUES (pJavaScriptDayIndex) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getWeekIndexId (
	IN pWeekNumber				    		INT,
	IN pWeekYear							INT,
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO weekindexes(`weekNumber`,`weekYear`) VALUES (pWeekNumber, pWeekYear) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getOccurenceId (
	IN pWeekIndexId				    	INT,
	IN pWeekDayId				    		INT,
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO occurrences(`fKWeekIndexId`,`fKWeekDayId`) VALUES (pWeekIndexId, pWeekDayId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getRestaurantId (
	IN pMenuUrl					    		VARCHAR(255),
	OUT idOut 								INT)
BEGIN	
	SET idOut =
    (SELECT `id` FROM restaurants WHERE `menuUrl` = pMenuUrl LIMIT 1);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getPriceId (
	IN pSEK						    		DECIMAL(6, 2),
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO prices(`sek`) VALUES (pSEK) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getLabelId (
	IN pName					    			VARCHAR(255),
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO labels(`name`) VALUES (pName) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE getDishId (
	IN pDescription				    	VARCHAR(255),
	IN pLabelId								INT,
	OUT idOut 								INT)
BEGIN	
	
	INSERT INTO dishes(`description`, `fKLabelId`) VALUES (pDescription, pLabelId) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE createAndGetMealId (
	IN pWeekDay_JavaScriptDayIndex  	INT,
	IN pWeekIndex_WeekNumber	    	INT,
	IN pWeekIndex_WeekYear          	INT,
	IN pRestaurant_MenuUrl          	VARCHAR(255),
	IN pPrice_SEK                   	DECIMAL(6, 2),
	IN pLabel_Name                  	VARCHAR(255),
   IN pDish_Description          	VARCHAR(255),
   IN pMeal_Error	                	VARCHAR(255),
	OUT idOut 								INT)
BEGIN

	CALL getWeekDayId(pWeekDay_JavaScriptDayIndex, @WeekDayId);

	CALL getWeekIndexId(pWeekIndex_WeekNumber, pWeekIndex_WeekYear, @WeekIndexId);

	CALL getOccurenceId(@WeekIndexId, @WeekDayId, @OccurenceId);

	CALL getRestaurantId(pRestaurant_MenuUrl, @RestaurantId);

	CALL getPriceId(pPrice_SEK, @PriceId);
    
	CALL getLabelId(pLabel_Name, @LabelId);

	CALL getDishId(pDish_Description, @LabelId, @DishId);


	INSERT INTO meals(`fKDishId`, `fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `error`) 
        VALUES (@DishId, @PriceId, @OccurenceId, @RestaurantId, pMeal_Error) 
    ON DUPLICATE KEY UPDATE `Error` = pMeal_Error, `id` = LAST_INSERT_ID(`id`);

	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;