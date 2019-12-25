USE `dbSulten`;

INSERT INTO `areas` (`name`) VALUES ('Malmö - Centrum');
INSERT INTO `areas` (`name`) VALUES ('Malmö - Västra Hamnen');
INSERT INTO `areas` (`name`) VALUES ('Lund - Brunnshög');
INSERT INTO `areas` (`name`) VALUES ('Lund - Sjukhuset');

INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('arabic', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('bread', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('breakfast', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('cake', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('chinese', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('coffee', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('dessert', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('drink', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('falafel', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('fast_food', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('fish_and_seafood', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('gratin', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('hotpot', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('indian', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('japanese', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('main', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('meal_of_the_day', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('meat', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('persian', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('pie', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('pizza', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('plain', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('pork', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('poultry', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('salad', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('sandwich', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('smoothie', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('snack', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('snacks', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('soup', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('starter', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('supper', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('thai', 1);
INSERT INTO `labels` (`name`, `alternativeIndex`) VALUES ('vegetarian', 1);

INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (0);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (1);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (2);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (3);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (4);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (5);
INSERT INTO `weekDays` (`javaScriptDayIndex`) VALUES (6);

INSERT INTO `prices` (`sek`) VALUES (-1);

INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(0, "Bricks Eatery", "https://brickseatery.se/lunch/", "55.716502", "13.226820", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög'));
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `longitude`, `latitude`, `fKAreaId`) VALUES 
	(0, "Fazer Restaurang Scotland Yard", "https://www.fazerfoodco.se/restauranger/restauranger/scotland-yard/", "55.718187", "13.226885", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög'));
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