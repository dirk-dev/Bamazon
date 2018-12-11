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
    if (err) console.log("error:", err);
    else {
        console.log("connected as id " + connection.threadId + "\n");
        inventoryDisplay();
        connection.end();
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

                        console.log("a.choice", answer.choice)
                        var chosenItem = answer.choice;

                        // for (var i = 0; i < results.length; i++) {
                        //     if (answer.choice === results[i].id) {
                        //         chosenItem = results[i];
                        //         console.log('chosen item', chosenItem);
                        //     }
                    }

                    // if (chosenItem.stock_quantity <= answer.units_to_buy) {
                    //     console.log("you're in luck")
                    // } else {
                    //     console.log("so sorry!");
                    // }

                    // console.log(answer)

                    // if (answer)
                });

    })
}


function purchaseInquiry() {

};


/*
PSEUDOCODE - 
**** issue - should only display ID, name, & price on screen on start

* take user input for id_to_buy, match with item_id from the DB.
* if (units_to_buy <= stock_qty) { decrement stock_quantity of item_id, 
    then - console.log("Thank you for your order. Your total price is", units_to_buy)

}
else {
    console.log("Sorry, we do not have that many in stock.");
}
   
 */