DROP DATABASE IF EXISTS `dbSulten`;
CREATE DATABASE `dbSulten`;
USE `dbSulten`;

CREATE TABLE `parts` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,

	`name`                              VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `partsDishes` (
	`id` 							    BIGINT NOT NULL AUTO_INCREMENT, 

	`fKPartId`					        INT NOT NULL,
	`fKDishId`					        INT NOT NULL,

	PRIMARY KEY (`id`)
);

CREATE TABLE `dishes` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,

	`description` 					    VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `indexes` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,

    `number` 				            INT,
	
	PRIMARY KEY (`id`)
);


CREATE TABLE `labels` (
	`id` 					            INT NOT NULL AUTO_INCREMENT,

	`name` 					            VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `alternatives` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,

	`fKDishId`					        INT NOT NULL,
	`fKIndexId`					        INT NOT NULL,
	`fKLabelId`					        INT NOT NULL,

	PRIMARY KEY (`id`)
);

CREATE TABLE `alternativesMeals` (
	`id` 							    INT NOT NULL AUTO_INCREMENT, 

	`fKAlternativeId`					INT NOT NULL,
	`fKMealId`					        BIGINT NOT NULL,

	PRIMARY KEY (`id`)
);

CREATE TABLE `meals` (
	`id`								BIGINT NOT NULL AUTO_INCREMENT,

    `lastUpdatedUTC`                    TIMESTAMP,
	`error`								TEXT,

	`fKPriceId`					        INT NOT NULL,
	`fKOccurrenceId`				    INT NOT NULL, 
	`fKRestaurantId`				    INT NOT NULL,	
	
	PRIMARY KEY (`id`)
);


CREATE TABLE `prices` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,	

	`sek` 					            DECIMAL(6, 2),
		
	PRIMARY KEY (`id`)
);

CREATE TABLE `restaurants` (
	`id`								INT NOT NULL AUTO_INCREMENT,
		
	`active` 							BIT NOT NULL,
	`name` 							    VARCHAR(255) NOT NULL,
	`menuUrl`							VARCHAR(255) NOT NULL,    
	`longitude`			                DECIMAL(11, 8) NOT NULL,
	`latitude`			                DECIMAL(10, 8) NOT NULL,

	`fKAreaId`						    INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `areas` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`name`							    VARCHAR(255) NOT NULL,

	`fKUrbanAreaId`						INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `urbanAreas` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`name`							    VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `weekIndexes` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`weekNumber`						INT NOT NULL,   
	`weekYear`						    INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `occurrences` (
	`id` 								INT NOT NULL AUTO_INCREMENT,

	`fKWeekIndexId`				        INT NOT NULL,
	`fKWeekDayId`					    INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `weekDays` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`dayIndex`				            INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

ALTER TABLE `partsDishes` ADD FOREIGN KEY (`fKPartId`) REFERENCES `parts`(`id`);
ALTER TABLE `partsDishes` ADD FOREIGN KEY (`fKDishId`) REFERENCES `dishes`(`id`);

ALTER TABLE `alternatives` ADD FOREIGN KEY (`fKDishId`) REFERENCES `dishes`(`id`);
ALTER TABLE `alternatives` ADD FOREIGN KEY (`fKIndexId`) REFERENCES `indexes`(`id`);
ALTER TABLE `alternatives` ADD FOREIGN KEY (`fKLabelId`) REFERENCES `labels`(`id`);

ALTER TABLE `alternativesMeals` ADD FOREIGN KEY (`fKAlternativeId`) REFERENCES `alternatives`(`id`);
ALTER TABLE `alternativesMeals` ADD FOREIGN KEY (`fKMealId`) REFERENCES `meals`(`id`) ON DELETE CASCADE;

ALTER TABLE `meals` ADD FOREIGN KEY (`fKPriceId`) REFERENCES `prices`(`id`);
ALTER TABLE `meals` ADD FOREIGN KEY (`fKOccurrenceId`) REFERENCES `occurrences`(`id`);
ALTER TABLE `meals` ADD FOREIGN KEY (`fKRestaurantId`) REFERENCES `restaurants`(`id`);

ALTER TABLE `restaurants` ADD FOREIGN KEY (`fKAreaId`) REFERENCES `areas`(`id`);

ALTER TABLE `areas` ADD FOREIGN KEY (`fKUrbanAreaId`) REFERENCES `urbanAreas`(`id`);

ALTER TABLE `occurrences` ADD FOREIGN KEY (`fKWeekIndexId`) REFERENCES `weekIndexes`(`id`);
ALTER TABLE `occurrences` ADD FOREIGN KEY (`fKWeekDayId`) REFERENCES `weekDays`(`id`);

ALTER TABLE	`parts` ADD UNIQUE (`name`);

ALTER TABLE	`partsDishes` ADD UNIQUE (`fKPartId`, `fKDishId`);

ALTER TABLE	`dishes` ADD UNIQUE (`description`);

ALTER TABLE	`indexes` ADD UNIQUE (`number`);

ALTER TABLE	`labels` ADD UNIQUE (`name`);

ALTER TABLE	`alternatives` ADD UNIQUE (`fKDishId`, `fKIndexId`, `fKLabelId`);

ALTER TABLE	`alternativesMeals` ADD UNIQUE (`fKAlternativeId`, `fKMealId`);

ALTER TABLE	`prices` ADD UNIQUE (`sek`);

ALTER TABLE	`restaurants` ADD UNIQUE (`menuUrl`);

ALTER TABLE	`areas` ADD UNIQUE (`name`, `fKUrbanAreaId`);

ALTER TABLE	`urbanAreas` ADD UNIQUE (`name`);

ALTER TABLE	`weekIndexes` ADD UNIQUE (`weekNumber`, `weekYear`);

ALTER TABLE	`occurrences` ADD UNIQUE (`fKWeekIndexId`, `fKWeekDayId`);

ALTER TABLE	`weekDays` ADD UNIQUE (`dayIndex`);