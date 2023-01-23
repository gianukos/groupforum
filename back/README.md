## ocP7 

The front-end client uses a MySql database to store information about accounts
and user activity on the app.
A back-end server and middleware connect to the Groupomania database.

### Using the Express app from a console

* Change to `P7/back` directory

* Install dependencies first by running `npm install`

* To create a database named `groupomania` and three tables run `node dbTablesCreate.js`.
    
* Assign values to environment variables in `.env` file

* `npm run start` will start the app