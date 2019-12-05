
INSERT INTO `areas` (`name`) VALUES ('Malmö - Centrum');
INSERT INTO `areas` (`name`) VALUES ('Malmö - Västra Hamnen');
INSERT INTO `areas` (`name`) VALUES ('Lund - Ideon');
INSERT INTO `areas` (`name`) VALUES ('Lund - Sjukhuset');

INSERT INTO `labels` (`name`) VALUES ('arabic');
INSERT INTO `labels` (`name`) VALUES ('bread');
INSERT INTO `labels` (`name`) VALUES ('breakfast');
INSERT INTO `labels` (`name`) VALUES ('cake');
INSERT INTO `labels` (`name`) VALUES ('coffee');
INSERT INTO `labels` (`name`) VALUES ('dessert');
INSERT INTO `labels` (`name`) VALUES ('drink');
INSERT INTO `labels` (`name`) VALUES ('falafel');
INSERT INTO `labels` (`name`) VALUES ('fast_food');
INSERT INTO `labels` (`name`) VALUES ('fish_and_seafood');
INSERT INTO `labels` (`name`) VALUES ('gratin');
INSERT INTO `labels` (`name`) VALUES ('hotpot');
INSERT INTO `labels` (`name`) VALUES ('indian');
INSERT INTO `labels` (`name`) VALUES ('main');
INSERT INTO `labels` (`name`) VALUES ('meal_of_the_day');
INSERT INTO `labels` (`name`) VALUES ('meat');
INSERT INTO `labels` (`name`) VALUES ('persian');
INSERT INTO `labels` (`name`) VALUES ('pie');
INSERT INTO `labels` (`name`) VALUES ('pizza');
INSERT INTO `labels` (`name`) VALUES ('plain');
INSERT INTO `labels` (`name`) VALUES ('pork');
INSERT INTO `labels` (`name`) VALUES ('poultry');
INSERT INTO `labels` (`name`) VALUES ('salad');
INSERT INTO `labels` (`name`) VALUES ('sandwich');
INSERT INTO `labels` (`name`) VALUES ('smoothie');
INSERT INTO `labels` (`name`) VALUES ('snack');
INSERT INTO `labels` (`name`) VALUES ('snacks');
INSERT INTO `labels` (`name`) VALUES ('soup');
INSERT INTO `labels` (`name`) VALUES ('starter');
INSERT INTO `labels` (`name`) VALUES ('supper');
INSERT INTO `labels` (`name`) VALUES ('thai');
INSERT INTO `labels` (`name`) VALUES ('vegetarian');


INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (0);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (1);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (2);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (3);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (4);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (5);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (6);

INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Kolga", "https://kolga.gastrogate.com/lunch/", "55.612298", "12.998472", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Miamarias", "http://www.miamarias.nu/", "55.613649", "12.991565", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Glasklart", "https://glasklart.eu/sv/lunch/", "55.615981", "12.990736", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Zen Thai", "http://www.zenthai.se/", "55.614280", "12.989225", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Variation", "https://www.nyavariation.se/files/matsedel/", "55.607987", "12.981666", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));