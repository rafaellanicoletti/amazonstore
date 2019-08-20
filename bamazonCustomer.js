var mysql = require("mysql");
var inquirer =  require("inquirer");
require ("console.table");

//connection w SQL database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});