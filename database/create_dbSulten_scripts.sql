CREATE TABLE `Labels` (
	`Id` 					            INT NOT NULL AUTO_INCREMENT,	

	`Name` 					            VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Dishes` (
	`Id` 							    INT NOT NULL AUTO_INCREMENT,	

	`Description` 					    VARCHAR(255) NOT NULL,
	
	`FK_Label_Id`					    INT NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Prices` (
	`Id` 							    INT NOT NULL AUTO_INCREMENT,	

	`SEK` 					            DECIMAL(4, 2) NOT NULL,
		
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Meals` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`Error`								VARCHAR(255),

	`FK_Dish_Id`					    INT,
	`FK_Price_Id`					    INT,
	`FK_Occurrence_Id`				    INT, 
	`FK_Restaurant_Id`				    INT NOT NULL,	
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Restaurants` (
	`Id`								INT NOT NULL AUTO_INCREMENT,
		
	`Active` 							BIT NOT NULL,
	`Name` 							    VARCHAR(255) NOT NULL,
	`MenuUrl`							VARCHAR(255) NOT NULL,
	`WebMealDealerClass`			    VARCHAR(255) NOT NULL,
	`Longitude`			                DECIMAL(11, 8) NOT NULL,
	`Latitude`			                DECIMAL(10, 8) NOT NULL,

	`FK_Area_Id`						INT NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Areas` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`Name`							    VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `WeekIndexes` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`WeekNumber`						INT NOT NULL,   
	`WeekYear`						    INT NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Occurrences` (
	`Id` 								INT NOT NULL AUTO_INCREMENT,

	`FK_WeekIndex_Id`				    INT NOT NULL,
	`FK_WeekDay_Id`					    INT NOT NULL,
	
	PRIMARY KEY (`Id`)
);

CREATE TABLE `WeekDays` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`JavaScriptDayIndex`				INT NOT NULL,
	
	PRIMARY KEY (`Id`)
);


ALTER TABLE `Dishes` ADD FOREIGN KEY (`FK_Label_Id`) REFERENCES `Labels`(`Id`);

ALTER TABLE `Meals` ADD FOREIGN KEY (`FK_Dish_Id`) REFERENCES `Dishes`(`Id`);
ALTER TABLE `Meals` ADD FOREIGN KEY (`FK_Price_Id`) REFERENCES `Prices`(`Id`);
ALTER TABLE `Meals` ADD FOREIGN KEY (`FK_Occurrence_Id`) REFERENCES `Occurrences`(`Id`);
ALTER TABLE `Meals` ADD FOREIGN KEY (`FK_Restaurant_Id`) REFERENCES `Restaurants`(`Id`);

ALTER TABLE `Restaurants` ADD FOREIGN KEY (`FK_Area_Id`) REFERENCES `Areas`(`Id`);

ALTER TABLE `Occurrences` ADD FOREIGN KEY (`FK_WeekIndex_Id`) REFERENCES `WeekIndexes`(`Id`);
ALTER TABLE `Occurrences` ADD FOREIGN KEY (`FK_WeekDay_Id`) REFERENCES `WeekDays`(`Id`);


ALTER TABLE	`Labels` ADD UNIQUE (`Name`);

ALTER TABLE	`Dishes` ADD UNIQUE (`Description`, `FK_Label_Id`);

ALTER TABLE	`Prices` ADD UNIQUE (`SEK`);

ALTER TABLE	`Meals` ADD UNIQUE (`FK_Dish_Id`, `FK_Price_Id`, `FK_Occurrence_Id`, `FK_Restaurant_Id`);

ALTER TABLE	`Restaurants` ADD UNIQUE (`MenuUrl`);
ALTER TABLE	`Restaurants` ADD UNIQUE (`WebMealDealerClass`);

ALTER TABLE	`Areas` ADD UNIQUE (`Name`);

ALTER TABLE	`WeekIndexes` ADD UNIQUE (`WeekNumber`, `WeekYear`);

ALTER TABLE	`Occurrences` ADD UNIQUE (`FK_WeekIndex_Id`, `FK_WeekDay_Id`);

ALTER TABLE	`WeekDays` ADD UNIQUE (`JavaScriptDayIndex`);