USE `dbSulten`;

INSERT INTO `areas` (`name`) VALUES ('Lund - Brunnshög') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `areas` (`name`) VALUES ('Lund - Sjukhuset') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `areas` (`name`) VALUES ('Malmö - Sjukhuset') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `areas` (`name`) VALUES ('Malmö - Stora Bernstorp') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `areas` (`name`) VALUES ('Malmö - Västra Hamnen') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `areas` (`name`) VALUES ('Södra Sandby - Hardeberga') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

INSERT INTO `labels` (`name`) VALUES ('a_la_carte') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('arabic') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('asian') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('bread') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('breakfast') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('cake') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('chinese') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('coffee') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('dessert') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('drink') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('falafel') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('fast_food') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('fish_and_seafood') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('gratin') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('hotpot') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('indian') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('japanese') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('main') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('meal_of_the_day') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('meat') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('persian') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('pie') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('pizza') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('plain') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('pork') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('poultry') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('salad') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('sandwich') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('smoothie') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('snack') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('snacks') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('soup') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('starter') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('supper') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('thai') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `labels` (`name`) VALUES ('vegetarian') ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

INSERT INTO `weekDays` (`dayIndex`) VALUES (0) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (1) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (2) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (3) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (4) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (5) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `weekDays` (`dayIndex`) VALUES (6) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

INSERT INTO `prices` (`sek`) VALUES (-1) ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Lund - Brunnshög
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Bricks Eatery", "https://brickseatery.se/lunch/", "55.716502", "13.226820", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Scotland Yard", "https://www.fazerfoodco.se/restauranger/restauranger/scotland-yard/", "55.718141", "13.226665", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Brunnshög')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Lund - Sjukhuset
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Bistro A Lund - Centralhallen", "https://www.amica.se/bistroalund?centralhallen", "55.711565", "13.198454", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Sjukhuset')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Bistro A Lund - Matakuten", "https://www.amica.se/bistroalund?matakuten", "55.711749", "13.199851", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Sjukhuset')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Patienthotellet Lund", "https://vardgivare.skane.se/patientadministration/maltider-och-matsedlar/", "55.712325", "13.197028", (SELECT `id` FROM `areas` WHERE `name`= 'Lund - Sjukhuset')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Malmö - Sjukhuset
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "FreDa 49", "https://www.freda49.se/lunch-malmo", "55.589817", "12.999629", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Sjukhuset')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Mötesplats CRC", "https://motesplatscrc.se/veckans-lunch/", "55.588726", "12.999257", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Sjukhuset')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Malmö - Stora Bernstorp
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Mor Marnas Matsal", "https://www.mormarnas.se/veckomeny.html", "55.616771", "13.120566", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Stora Bernstorp'))
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Öresundsterminalen", "https://www.oresundsterminalen.se/sv/veckomeny", "55.608108", "13.095928", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Stora Bernstorp')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Malmö - Västra Hamnen
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Glasklart", "https://glasklart.eu/sv/lunch/", "55.615981", "12.990736", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Lokal 17", "https://lokal17.se/", "55.611998", "12.995554", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "MH Matsalar", "http://www.mhmatsalar.se/", "55.610916", "12.995886", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Miamarias", "http://www.miamarias.nu/", "55.613649", "12.991565", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "P2", "https://www.restaurangp2.se/lunch", "55.614408", "12.988367", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Kolga", "https://restaurangkolga.se/lunch/", "55.612298", "12.998472", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Restaurang KP", "https://restaurangkp.se/lunchbuffe/", "55.609909", "12.998627", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Niagara", "https://restaurangniagara.se/lunch/", "55.609033", "12.994625", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Restaurang Variation", "https://www.nyavariation.se/matsedel/", "55.607987", "12.981666", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Stora Varvsgatan 6", "https://www.storavarvsgatan6.se/projects.html", "55.612268", "12.991715", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "White Shark", "https://whiteshark.gastrogate.com/lunch/", "55.615005", "12.986016", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Zen Thai", "http://www.zenthai.se/", "55.614280", "12.989225", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Årstiderna by the sea", "http://arstidernabythesea.se/lunch/", "55.615184", "12.988667", (SELECT `id` FROM `areas` WHERE `name`= 'Malmö - Västra Hamnen')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);

-- Södra Sandby - Hardeberga
INSERT INTO `restaurants` (`active`, `name`, `menuUrl`, `latitude`, `longitude`, `fKAreaId`) VALUES 
	(1, "Skrylle Restaurang", "http://www.skryllerestaurang.se/", "55.692211", "13.359271", (SELECT `id` FROM `areas` WHERE `name`= 'Södra Sandby - Hardeberga')) 
    ON DUPLICATE KEY UPDATE `id` = LAST_INSERT_ID(`id`);