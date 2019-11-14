PRAGMA encoding = 'UTF-8';

CREATE TABLE `Labels` (
	`Id` 					INT NOT NULL AUTO_INCREMENT,	

	`Name` 					VARCHAR(255) NOT NULL,
	
	FOREIGN KEY (FK_Dishes_Id) REFERENCES Dishes (Id)
);



CREATE TABLE `Dishes` (
	`Id` 							INT NOT NULL AUTO_INCREMENT,	

	`Description` 					VARCHAR(255) NOT NULL,
);

CREATE TABLE `Meals` (
	`Id`								INT NOT NULL AUTO_INCREMENT,	
	`Error`								VARCHAR(255),

	`FK_Dishes_Id`					INT NOT NULL,
	`FK_Occurrences_Id`				INT NOT NULL, 
	`FK_Restaurants_Id`				INT NOT NULL,
	
	FOREIGN KEY (FK_Restaurants_Id) REFERENCES Restaurants (Id),
	FOREIGN KEY (FK_Dishes_Id) REFERENCES Dishes (Id),
	FOREIGN KEY (FK_Occurrences_Id) REFERENCES Occurrences (Id)
);

CREATE TABLE `Restaurants` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`FK_Areas_Id`						INT NOT NULL,
		
	`Active` 							BIT NOT NULL,
	`Name` 							VARCHAR(255) NOT NULL,
	`MenuUrl`							VARCHAR(255) NOT NULL,
	`TypeScriptClassParser`			VARCHAR(255) NOT NULL,
	`Longitude`			DECIMAL(11, 8) NOT NULL,
	`Latitude`			DECIMAL(10, 8) NOT NULL,
	
	FOREIGN KEY (FK_Areas_Id) REFERENCES Areas (Id)
);

CREATE TABLE `Areas` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`Name`							VARCHAR(255) NOT NULL,
);

CREATE TABLE `WeekIndexes` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`WeekNumber`						INT NOT NULL,   
	`WeekYear`						INT NOT NULL,

	UNIQUE(WeekNumber,WeekYear)
);

CREATE TABLE Occurrences (
	`Id` 								INT NOT NULL AUTO_INCREMENT,

	`FK_WeekIndexes_Id`				INT NOT NULL,
	`FK_WeekDays_Id`					INT NOT NULL,

	FOREIGN KEY (FK_WeekIndexes_Id) REFERENCES WeekIndexes (Id),
	FOREIGN KEY (FK_WeekDays_Id) REFERENCES WeekDays (Id)
);

CREATE TABLE `WeekDays` (
	`Id`								INT NOT NULL AUTO_INCREMENT,

	`JavascriptDayIndex`				INT NOT NULL
);
