DROP PROCEDURE IF EXISTS GetWeekDay_Id;
DROP PROCEDURE IF EXISTS GetWeekIndex_Id;
DROP PROCEDURE IF EXISTS GetOccurence_Id;
DROP PROCEDURE IF EXISTS GetRestaurant_Id;
DROP PROCEDURE IF EXISTS GetPrice_Id;
DROP PROCEDURE IF EXISTS GetLabel_Id;
DROP PROCEDURE IF EXISTS GetDish_Id;
DROP PROCEDURE IF EXISTS CreateAndGetMeal_Id;

DELIMITER $$
CREATE PROCEDURE GetWeekDay_Id (
	IN p_JavaScriptDayIndex		    INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO weekdays(`JavaScriptDayIndex`) VALUES (p_JavaScriptDayIndex) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetWeekIndex_Id (
	IN p_WeekNumber				    INT,
	IN p_WeekYear					INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO weekindexes(`WeekNumber`,`WeekYear`) VALUES (p_WeekNumber, p_WeekYear) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetOccurence_Id (
	IN p_WeekIndex_Id				INT,
	IN p_WeekDay_Id				    INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO occurrences(`FK_WeekIndex_Id`,`FK_WeekDay_Id`) VALUES (p_WeekIndex_Id, p_WeekDay_Id) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetRestaurant_Id (
	IN p_MenuUrl					VARCHAR(255),
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO restaurants(`MenuUrl`) VALUES (p_MenuUrl) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetPrice_Id (
	IN p_SEK						DECIMAL(4, 2),
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO prices(`SEK`) VALUES (p_SEK) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetLabel_Id (
	IN p_Name					    VARCHAR(255),
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO labels(`Name`) VALUES (p_Name) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetDish_Id (
	IN p_Description				VARCHAR(255),
	IN p_Label_Id				    INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO dishes(`Description`, `FK_Label_Id`) VALUES (p_Description, p_Label_Id) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE CreateAndGetMeal_Id (
	IN p_WeekDay_JavaScriptDayIndex INT,
	IN p_WeekIndex_WeekNumber	    INT,
	IN p_WeekIndex_WeekYear         INT,
	IN p_Restaurant_MenuUrl         VARCHAR(255),
	IN p_Price_SEK                  DECIMAL(4, 2),
	IN p_Label_Name                 VARCHAR(255),
    IN p_Description_Description	VARCHAR(255),
    IN p_Meal_Error	                VARCHAR(255),
	OUT idOut 						INT)
BEGIN

	CALL GetRegisteredScheduler(p_WeekDay_JavaScriptDayIndex, @WeekDay_Id);

	CALL GetWeekIndex_Id(p_WeekIndex_WeekNumber, p_WeekIndex_WeekYear, @WeekIndex_Id);

	CALL GetOccurence_Id(@WeekIndex_Id, @WeekDay_Id, @Occurence_Id);


	CALL GetRestaurant_Id(p_Restaurant_MenuUrl, @Restaurant_Id);


	CALL GetPrice_Id(p_Price_SEK, @Price_Id);

    
	CALL GetLabel_Id(p_Label_Name, @Label_Id);


	CALL GetDish_Id(p_Description_Description, @Label_Id, @Dish_Id);



	INSERT INTO meals(`FK_Dish_Id`, `FK_Price_Id`, `FK_Occurrence_Id`, `FK_Restaurant_Id`, `Error`) 
        VALUES (@Dish_Id, @Price_Id, @Occurence_Id, @Restaurant_Id, p_Meal_Error) 
    ON DUPLICATE KEY UPDATE `Error` = p_Meal_Error, `Id` = LAST_INSERT_ID(`Id`);

	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;