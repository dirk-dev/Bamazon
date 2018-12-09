const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
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
        inventoryDisplay();
        connection.end();
    }

})

function inventoryDisplay() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw (err);
        console.table(results);
    })
}

inquirer.prompt([{
            name: 'id_to_buy',
            type: 'input',
            message: 'What is the id of the product you want to purchase?'
        },
        {
            name: 'units_to_buy',
            type: 'input',
            message: 'How many units do want to buy?'
        }

    ])
    .then(
        console.log('prompts away!')

    );

/*
PSEUDOCODE - 
* take user input for id_to_buy, match with item_id from the DB.
* if (units_to_buy <= stock_qty) { decrement stock_quantity of item_id, 
    then - console.log("Thank you for your order. Your total price is", units_to_buy * price)

}
else {
    console.log("Sorry, we do not have that many in stock.");
}


    
 */

// for user input
// connection.connect(function (err) {
//     if (err)
//         console.log("error:", err);
// })