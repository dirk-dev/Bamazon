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

connection.connect(function (err) {
    if (err) console.log("error:", err);
    else {
        console.log("connected as id " + connection.threadId + "\n");
        inventoryDisplay();
    }

})

function inventoryDisplay() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("Items available for sale:");
        console.table(results);
        console.log("---------------------------------------------------------");

        inquirer.prompt([{
                    name: 'choice',
                    type: 'input',
                    message: 'What is the id of the product you want to purchase?',
                    validate: function (value) {
                        //prevents user from entering invalid input
                        if (value > results.length) {
                            return false;
                        }
                        if (value < 1) {
                            return false;
                        }
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: 'units_to_buy',
                    type: 'input',
                    message: 'How many units do want to buy?',
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

                for (let i = 0; i < results.length; i++) {
                    let currentItem = results[i];
                    if (currentItem.item_id == chosenItem) {
                        if (orderQty <= currentItem.stock_quantity) {
                            console.log('Your order is approved. Your total cost is $', (orderQty * currentItem.price).toFixed(2));

                            let updateQuery = "UPDATE products SET stock_quantity = " + (currentItem.stock_quantity - orderQty) +
                                " WHERE item_id = " + currentItem.item_id;

                            console.log(updateQuery);

                            connection.query(updateQuery,
                                function (err, results) {
                                    if (err) throw err;
                                    connection.end();
                                })

                        } else {
                            console.log('Sorry, your order was denied. Please try again')

                            inventoryDisplay();
                        }
                    }
                }
            });
    })
}

function purchaseInquiry() {

};