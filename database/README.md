# Install

This is a very short guide on how it is possible to set up the ´dbSulten.db´ (Sulten database) on your computer:

1. Download and install [SQLiteStudio](https://www.sqlitetutorial.net/download-install-sqlite/) on your computer
1. SQLiteStudio > Database > Add a database >  + _(create a new database file)_ > File name: `./sulten/database/dbSulten` > Save
1. SQLiteStudio > In the database explorer, click on `dbSulten` > Database > Connect to the database
1. SQLiteStudio > In the database explorer, right click on `dbSulten` > 'Execute SQL from file' > `./sulten/database/create_dbSulten_scripts.sql`
1. SQLiteStudio > In the database explorer, right click on `dbSulten` > 'Execute SQL from file' > `./sulten/database/initialize_dbSulten_scripts.sql`