# Movies App - Backend
API developed with Node and Express, and used by the project [movies-frontend](https://github.com/carloshrod/movies-frontend).

## Technologies and libraries
* Node
* Express
* PostgreSQL
* Node-Postgres
* Cloudinary
* Express-fileupload
* Fs-extra

## Run app
1. Clone or download the project to your computer.
2. Create a Postgres database, using the commands and structure described in **src/database/db.sql**. If the database is local, configure the pool in **src/database/db.js** with **ssl: false**.
3. Set the environment variables described in the **env-example.txt** file.
4. Install dependencies with the **npm install** command or its **yarn** equivalent.
5. Run **npm run dev** command or its **yarn** equivalent.
