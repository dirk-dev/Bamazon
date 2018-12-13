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

// function buyAgain() {

//     inquirer.prompt([{
//         name: 'choice',
//         type: 'list',
//         choices: ['YES', 'NO'],
//         message: 'Do you want to buy anything else?\n Type CTRL-C to quit.\n',
//         validate: function (value) {
//             if (value == 'YES') {
//                 console.log('i.d. called')
//                 inventoryDisplay();
//             } else {
//                 console.log('c.e. called')
//                 connection.end();
//                 return;
//             }
//         }
//     }])
// }

function inventoryDisplay() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log('\n')
        console.log('\x1b[36mItems available for sale:\x1b[0m');
        console.table(results);
        console.log("---------------------------------------------------------");

        inquirer.prompt([{
                    name: 'choice',
                    type: 'input',
                    message: 'What is the id of the product you want to purchase? [Type q to quit]',
                    validate: function (value) {
                        //prevents user from entering invalid input
                        if ((value > results.length) || (value < 1)) {
                            return false;
                        }
                        if ((isNaN(value) === false) && (value !== 'q')) {
                            return true;
                        }
                        if (value === 'q') {
                            connection.end()
                            return false;
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
                            console.log('\nYour order is approved. Your total cost is $' + (orderQty * currentItem.price).toFixed(2));

                            // updates MySQL database
                            let updateQuery = "UPDATE products SET stock_quantity = " + (currentItem.stock_quantity - orderQty) +
                                " WHERE item_id = " + currentItem.item_id;

                            connection.query(updateQuery,
                                function (err, results) {
                                    if (err) throw err;

                                })
                        } else {
                            console.log('\n\x1b[31mSorry, we do not have that many in stock.\x1b[0m');
                        }
                        inventoryDisplay();
                    }
                }
            });
    })
}