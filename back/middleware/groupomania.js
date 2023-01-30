let mysql = require("mysql");
require("dotenv").config();
const util = require("util")

const connection = mysql.createConnection({ user: "root", host: "localhost", password: process.env.POST_PASS})
connection.query = util.promisify(connection.query)

connection.query(
    `
      CREATE DATABASE IF NOT EXISTS groupomania ;
    `
      , function(error){if (error) throw error;}
  )
  
  module.exports = connection;
