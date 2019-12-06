DROP DATABASE IF EXISTS `dbSulten`;
CREATE DATABASE `dbSulten`;
USE `dbSulten`;

CREATE TABLE `labels` (
	`id` 					            INT NOT NULL AUTO_INCREMENT,	

	`name` 					            VARCHAR(255) NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `dishes` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,	

	`description` 					    VARCHAR(255) NOT NULL,
	
	`fKLabelId`					        INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `prices` (
	`id` 							    INT NOT NULL AUTO_INCREMENT,	

	`sek` 					            DECIMAL(6, 2) NOT NULL,
		
	PRIMARY KEY (`id`)
);

CREATE TABLE `meals` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`error`								VARCHAR(255),

	`fKDishId`					        INT,
	`fKPriceId`					        INT,
	`fKOccurrenceId`				    INT, 
	`fKRestaurantId`				    INT NOT NULL,	
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `restaurants` (
	`id`								INT NOT NULL AUTO_INCREMENT,
		
	`active` 							BIT NOT NULL,
	`name` 							    VARCHAR(255) NOT NULL,
	`menuUrl`							VARCHAR(255) NOT NULL,    
	`longitude`			                DECIMAL(11, 8) NOT NULL,
	`latitude`			                DECIMAL(10, 8) NOT NULL,

	`fKAreaId`						INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `areas` (
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

	`fKWeekIndexId`				    INT NOT NULL,
	`fKWeekDayId`					    INT NOT NULL,
	
	PRIMARY KEY (`id`)
);

CREATE TABLE `weekDays` (
	`id`								INT NOT NULL AUTO_INCREMENT,

	`javaScriptDayIndex`				INT NOT NULL,
	
	PRIMARY KEY (`id`)
);


ALTER TABLE `dishes` ADD FOREIGN KEY (`fKLabelId`) REFERENCES `labels`(`id`);

ALTER TABLE `meals` ADD FOREIGN KEY (`fKDishId`) REFERENCES `dishes`(`id`);
ALTER TABLE `meals` ADD FOREIGN KEY (`fKPriceId`) REFERENCES `prices`(`id`);
ALTER TABLE `meals` ADD FOREIGN KEY (`fKOccurrenceId`) REFERENCES `occurrences`(`id`);
ALTER TABLE `meals` ADD FOREIGN KEY (`fKRestaurantId`) REFERENCES `restaurants`(`id`);

ALTER TABLE `restaurants` ADD FOREIGN KEY (`fKAreaId`) REFERENCES `areas`(`id`);

ALTER TABLE `occurrences` ADD FOREIGN KEY (`fKWeekIndexId`) REFERENCES `weekIndexes`(`id`);
ALTER TABLE `occurrences` ADD FOREIGN KEY (`fKWeekDayId`) REFERENCES `weekDays`(`id`);


ALTER TABLE	`labels` ADD UNIQUE (`name`);

ALTER TABLE	`dishes` ADD UNIQUE (`description`, `fKLabelId`);

ALTER TABLE	`prices` ADD UNIQUE (`sek`);

ALTER TABLE	`meals` ADD UNIQUE (`fKDishId`, `fKPriceId`, `fKOccurrenceId`, `fKRestaurantId`);

ALTER TABLE	`restaurants` ADD UNIQUE (`menuUrl`);

ALTER TABLE	`areas` ADD UNIQUE (`name`);

ALTER TABLE	`weekIndexes` ADD UNIQUE (`weekNumber`, `weekYear`);

ALTER TABLE	`occurrences` ADD UNIQUE (`fKWeekIndexId`, `fKWeekDayId`);

ALTER TABLE	`weekDays` ADD UNIQUE (`javaScriptDayIndex`);