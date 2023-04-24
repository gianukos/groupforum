// module providing asynchronous handling of database queries
const util = require("util");
require("dotenv").config();


let mysql = require("mysql2")

const groupomaniaPoolConfig = {
  connectionLimit: 10,
  user: "root",
  host: "localhost",
  password: process.env.POST_PASS,
  port: 3306,
  database: "groupomania"
}
const pool = mysql.createPool (groupomaniaPoolConfig)

// check for common exceptions
pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
      }
    }
  
    if (connection) connection.release()
    return
  });
  
  // Promisify for Node.js async/await.
  pool.query = util.promisify(pool.query)

  pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
  
  module.exports = pool