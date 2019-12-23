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
	IN pMeal_FKDishId				INT,
	IN pMeal_FKPriceId				INT,
	IN pMeal_FKOccurrenceId			INT,  
	IN pMeal_FKRestaurantId			INT)
BEGIN

    SET @pMeal_FKDishId = pMeal_FKDishId;
    SET @pMeal_FKPriceId = pMeal_FKPriceId;
    SET @pMeal_FKOccurrenceId = pMeal_FKOccurrenceId;
    SET @pMeal_FKRestaurantId = pMeal_FKRestaurantId;
	
	DELETE m
	FROM meals AS m
	WHERE		
		m.fKDishId = @pMeal_FKDishId AND 
		m.fKPriceId = @pMeal_FKPriceId AND         
		m.fKOccurrenceId = @pMeal_FKOccurrenceId AND 
		m.fKRestaurantId = @pMeal_FKRestaurantId;
		
	IF ISNULL(@pMeal_FKDishId) AND ISNULL(@pMeal_FKPriceId) THEN 	
		DELETE m
		FROM meals AS m
		WHERE		
			ISNULL(m.fKDishId) AND
			ISNULL(m.fKPriceId) AND
			m.fKOccurrenceId = @pMeal_FKOccurrenceId AND 
			m.fKRestaurantId = @pMeal_FKRestaurantId;
	ELSE	
		DELETE m
		FROM meals AS m
		WHERE		
			m.fKDishId = @pMeal_FKDishId AND 
			m.fKPriceId = @pMeal_FKPriceId AND         
			m.fKOccurrenceId = @pMeal_FKOccurrenceId AND 
			m.fKRestaurantId = @pMeal_FKRestaurantId;
	END IF;

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
    IN pMeal_Error	                	    TEXT)
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

    IF  @pDish_Description = "" THEN
        -- if we end up here, this usually means failure from meal dealers
        SET @PriceId = null;
        SET @DishId = null;
    ELSE
        CALL getPriceId(@pPrice_SEK, @PriceId);

        CALL getLabelId(@pLabel_Name, @LabelId);
        CALL getAlternativeId(@pAlternative_Index, @AlternativeId);	
        CALL getLabelAlternativeId(@LabelId, @AlternativeId, @LabelAlternativeId);

        CALL getDishId(@pDish_Description, @LabelId, @DishId);

    END IF;
    
    CALL deletePossibleOldMeal(@DishId, @PriceId, @OccurenceId, @RestaurantId);

    

	INSERT INTO meals(`fKDishId`, `fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`, `error`)    VALUES (@DishId, @PriceId, @OccurenceId, @RestaurantId, @pMeal_Error)
    ON DUPLICATE KEY UPDATE `Error` = @pMeal_Error, `id` = LAST_INSERT_ID(`id`);

	SELECT LAST_INSERT_ID();
END$$
DELIMITER ;
