# Bamazon

## Setup - Database:
1. Open the code for `bamazon_schema.sql` in your text editor (Visual Studio Code is shown in the screenshots). Paste it into the Query window of `MySQL Workbench`. 
2. Click the leftmost lightning-bolt icon (to the right of the disk icon), or select Query - Execute (All or Selection) in the Workbench menu. This will create the schema (skeleton) for the database. 
3. Then click on the refresh icon at the top right side of the SCHEMAS panel to confirm that the database was created. It should be called bamazon_db. Click on the dropdown arrows of the database and confirm that the database was created, and that it has a table named `products` with a number of columns.

![creating schema](images/gifs/run_schema.gif)

4. Delete the existing code and paste in the contents of the `bamazon_seeds.sql` file. This will import the data into the database. Click the left-most lighting bolt and click the refresh. expand the tables, and select the product table. Three small black icons will appear to the right. Click the right-most one, which looks like a small spreadsheet with a lightning bolt in the corner. This will display a preview of the database. Confirm that the database was created. You can also check the Output window on the bottom for any error messsages.

![creating seeds](images/gifs/run_seeds.gif)

############## set up port info/password etc.
############### info MAMP app

## Setup - Node:
run npm i to copy mysql, inquirer, ???ctable


## Technologies used:
* JavaScript
* Node.js - https://nodejs.org
* MySQL Workbench - https://www.mysql.com/products/workbench/
* MAMP local server - https://www.mamp.info/en/
* console.table (for formating console output) - https://www.npmjs.com/package/console.table