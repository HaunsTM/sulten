DROP PROCEDURE IF EXISTS GetWeekDays_Id;

DELIMITER $$
CREATE PROCEDURE GetWeekDays_Id (
	IN p_JavaScriptDayIndex		INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO weekdays(`JavaScriptDayIndex`) VALUES (p_JavaScriptDayIndex) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetWeekIndex_Id (
	IN p_WeekNumber				INT,
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
	IN p_WeekDay_Id				INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO occurrences(`FK_WeekIndex_Id`,`FK_WeekDay_Id`) VALUES (p_WeekIndex_Id, p_WeekDay_Id) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetRestaurant_Id (
	IN p_MenuUrl					VARCHAR,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO restaurants(`MenuUrl`) VALUES (p_MenuUrl) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetPrice_Id (
	IN p_SEK							DECIMAL,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO prices(`SEK`) VALUES (p_SEK) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetLabel_Id (
	IN p_Name					VARCHAR,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO labels(`Name`) VALUES (p_Name) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetDish_Id (
	IN p_Description					VARCHAR,
	IN p_Label_Id				INT,
	OUT idOut 						INT)
BEGIN	
	
	INSERT INTO dishes(`Description`, `FK_Label_Id`) VALUES (p_Name) ON DUPLICATE KEY UPDATE `Id` = LAST_INSERT_ID(`Id`);
	
	SELECT LAST_INSERT_ID() INTO idOut;
END$$
DELIMITER ;