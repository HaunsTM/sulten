INSERT INTO Areas (Name) VALUES ('Västra Hamnen - Malmö' );

INSERT INTO Restaurants ( FK_Areas_Id, Active, Name, MenuUrl, TypeScriptClassParser ) 
    VALUES ( (SELECT Id FROM Areas WHERE [Areas].[Name] = 'Västra Hamnen - Malmö'),
             1, 'Kolga',  'https://restaurangkolga.se/lunch/1/', 'KolgaParser' );
INSERT INTO Restaurants ( FK_Areas_Id, Active, Name, MenuUrl, TypeScriptClassParser ) 
    VALUES ( (SELECT Id FROM Areas WHERE [Areas].[Name] = 'Västra Hamnen - Malmö'),
             1, 'Glasklart',  'https://glasklart.eu/sv/lunch/', 'GlasklartParser' );
INSERT INTO Restaurants ( FK_Areas_Id, Active, Name, MenuUrl, TypeScriptClassParser ) 
    VALUES ( (SELECT Id FROM Areas WHERE [Areas].[Name] = 'Västra Hamnen - Malmö'),
             1, 'Zen Thai',  'http://www.zenthai.se/', 'ZenThaiParser' );

INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '0', 'Sunday', 'Söndag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '1', 'Monday', 'Måndag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '2', 'Tuesday', 'Tisdag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '3', 'Wednesday', 'Onsdag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '4', 'Thursday', 'Torsdag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '5', 'Friday', 'Fredag' );
INSERT INTO WeekDays ( JavascriptDayIndex, Name_ENG, Name_SE ) VALUES ( '6', 'Saturday', 'Lördag' );