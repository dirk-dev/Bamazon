const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your passwords
    password: "root",
    database: "bamazon_DB"
});

// initial database connection and inventory display
connection.connect(function (err) {
    if (err) console.log("error:", err);
    else {
        // console.log("connected as id " + connection.threadId + "\n");
        inventoryDisplay();
    }
})

function inventoryDisplay() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("\n\x1b[36mItems available for sale:\x1b[0m\n");
        console.table(results);
        console.log("---------------------------------------------------------------------");
        userQuit();

    })
}

function userQuit() {

    inquirer.prompt([{
            name: 'quit',
            type: 'confirm',
            message: 'Do you want to quit?',
        }])
        .then(function (answer) {
            if (answer.quit == true) {
                connection.end();
                return false;
            }
            orderEntry();
        })
}

function orderEntry() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) {
            console.log('error', err)
        };
        console.log('\n')
        console.table(results);
        console.log("---------------------------------------------------------------------\n");


        inquirer.prompt([{
                    name: 'choice',
                    type: 'input',
                    message: 'What is the item id of the product you want to purchase?',
                    validate: function (value) {
                        if ((value > results.length) || (value < 1)) {
                            return false;
                        } else if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: 'units_to_buy',
                    type: 'input',
                    message: 'How many do want to buy?',
                    validate: function (value) {
                        if (value < 1) {
                            return false;
                        }
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {

                var chosenItem = answer.choice;
                var orderQty = answer.units_to_buy;

                //loops through array of objects to compare order quantity to available stock quantity
                for (let i = 0; i < results.length; i++) {
                    let currentItem = results[i];
                    if (currentItem.item_id == chosenItem) {
                        if (orderQty <= currentItem.stock_quantity) {
                            console.log("\n\x1b[1m", "\x1b[44m", "Your order is approved. Your total cost is $" + (orderQty * currentItem.price).toFixed(2), "\x1b[0m");

                            // updates MySQL database
                            let updateQuery = "UPDATE products SET stock_quantity = " + (currentItem.stock_quantity - orderQty) +
                                " WHERE item_id = " + currentItem.item_id;

                            connection.query(updateQuery,
                                function (err, results) {
                                    if (err) throw err;

                                })
                        } else {
                            console.log('\n\x1b[31mSorry, we do not have that many in stock.\x1b[0m\n');
                        }
                        userQuit();
                    }
                }
            });
    })
}