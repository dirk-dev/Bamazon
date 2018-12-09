var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err)
        console.log("error:", err);
    else {
        console.log("connected as id " + connection.threadId + "\n");
        // start();
        connection.end();
    }

})