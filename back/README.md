## ocP7 

The front-end client uses a MySql database to store information about accounts and user activity on the app.

A back-end server and middleware connect to the Groupomania database as user 'root' on the default port. Before a connection can be made the database server must be running on the localhost.

#### Using the Express app from a console

* Change directory    
    `$ cd ocP7/back`

* Install dependencies    
    `$ npm install`

* Assign values to environment variables in `.env` file

* Run script to create a database named `groupomania` and three tables   
    `$ node dbTablesCreate.js`.

* start the app    
    `$ npm run start` 