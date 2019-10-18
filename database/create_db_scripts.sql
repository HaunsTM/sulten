CREATE TABLE Dishes (
	Id INTEGER PRIMARY KEY,

	Description TEXT NOT NULL
);

CREATE TABLE Meals (
	Id								INTEGER PRIMARY KEY,

	FK_Dishes_Id					INTEGER NOT NULL,
	FK_Occurrences_Id				INTEGER NOT NULL, 
	FK_Restaurants_Id				INTEGER NOT NULL,
	
	FOREIGN KEY (FK_Restaurants_Id) REFERENCES Restaurants (Id),
	FOREIGN KEY (FK_Dishes_Id) REFERENCES Dishes (Id),
	FOREIGN KEY (FK_Occurrences_Id) REFERENCES Occurrences (Id)
);

CREATE TABLE Restaurants (
	Id								INTEGER PRIMARY KEY,

	FK_Areas_Id						INTEGER NOT NULL,
		
	Active 							INTEGER NOT NULL,
	Name 							TEXT NOT NULL,
	MenuUrl							TEXT UNIQUE,
	
	FOREIGN KEY (FK_Areas_Id) REFERENCES Areas (Id)
);

CREATE TABLE Areas (
	Id								INTEGER PRIMARY KEY,

	Name							TEXT NOT NULL
);

CREATE TABLE WeekIndexes (
	Id								INTEGER PRIMARY KEY,

	WeekNumber						INTEGER NOT NULL,   
	WeekYear						INTEGER NOT NULL,

	UNIQUE(WeekNumber,WeekYear)
);

CREATE TABLE Occurrences (
	Id 								INTEGER PRIMARY KEY,

	FK_WeekIndexes_Id				INTEGER NOT NULL,
	FK_WeekDays_Id					INTEGER NOT NULL,
	FOREIGN KEY (FK_WeekIndexes_Id) REFERENCES WeekIndexes (Id),
	FOREIGN KEY (FK_WeekDays_Id) REFERENCES WeekDays (Id)
);

CREATE TABLE WeekDays (
	Id								INTEGER PRIMARY KEY,

	Name							TEXT NOT NULL
);
