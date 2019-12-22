USE `dbSulten`;

INSERT INTO `areas` (`name`) VALUES ('Malmö - Centrum');
INSERT INTO `areas` (`name`) VALUES ('Malmö - Västra Hamnen');
INSERT INTO `areas` (`name`) VALUES ('Lund - Brunnshög');
INSERT INTO `areas` (`name`) VALUES ('Lund - Sjukhuset');

INSERT INTO `labels` (`name`) VALUES ('arabic');
INSERT INTO `labels` (`name`) VALUES ('bread');
INSERT INTO `labels` (`name`) VALUES ('breakfast');
INSERT INTO `labels` (`name`) VALUES ('cake');
INSERT INTO `labels` (`name`) VALUES ('chinese');
INSERT INTO `labels` (`name`) VALUES ('coffee');
INSERT INTO `labels` (`name`) VALUES ('dessert');
INSERT INTO `labels` (`name`) VALUES ('drink');
INSERT INTO `labels` (`name`) VALUES ('falafel');
INSERT INTO `labels` (`name`) VALUES ('fast_food');
INSERT INTO `labels` (`name`) VALUES ('fish_and_seafood');
INSERT INTO `labels` (`name`) VALUES ('gratin');
INSERT INTO `labels` (`name`) VALUES ('hotpot');
INSERT INTO `labels` (`name`) VALUES ('indian');
INSERT INTO `labels` (`name`) VALUES ('japanese');
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

INSERT INTO `alternatives` (`index`) VALUES (-1);
INSERT INTO `alternatives` (`index`) VALUES (1);
INSERT INTO `alternatives` (`index`) VALUES (2);
INSERT INTO `alternatives` (`index`) VALUES (3);
INSERT INTO `alternatives` (`index`) VALUES (4);
INSERT INTO `alternatives` (`index`) VALUES (5);
INSERT INTO `alternatives` (`index`) VALUES (6);
INSERT INTO `alternatives` (`index`) VALUES (7);
INSERT INTO `alternatives` (`index`) VALUES (8);
INSERT INTO `alternatives` (`index`) VALUES (9);
INSERT INTO `alternatives` (`index`) VALUES (10);
INSERT INTO `alternatives` (`index`) VALUES (11);
INSERT INTO `alternatives` (`index`) VALUES (12);
INSERT INTO `alternatives` (`index`) VALUES (13);
INSERT INTO `alternatives` (`index`) VALUES (14);
INSERT INTO `alternatives` (`index`) VALUES (15);
INSERT INTO `alternatives` (`index`) VALUES (16);
INSERT INTO `alternatives` (`index`) VALUES (17);
INSERT INTO `alternatives` (`index`) VALUES (18);
INSERT INTO `alternatives` (`index`) VALUES (19);
INSERT INTO `alternatives` (`index`) VALUES (20);

INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (0);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (1);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (2);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (3);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (4);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (5);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (6);

INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Bricks Eatery", "https://brickseatery.se/lunch/", "55.716502", "13.226820", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Fazer Restaurang Scotland Yard", "https://www.fazerfoodco.se/restauranger/restauranger/scotland-yard/", "55.718187", "13.226885", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Glasklart", "https://glasklart.eu/sv/lunch/", "55.615981", "12.990736", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Kolga", "https://kolga.gastrogate.com/lunch/", "55.612298", "12.998472", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Lokal 17", "https://lokal17.se/", "55.611998", "12.995554", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Miamarias", "http://www.miamarias.nu/", "55.613649", "12.991565", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Variation", "https://www.nyavariation.se/matsedel/", "55.607987", "12.981666", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(1, "Zen Thai", "http://www.zenthai.se/", "55.614280", "12.989225", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen'));