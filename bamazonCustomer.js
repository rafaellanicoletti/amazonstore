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


//connection w server and loads products

connection.connect(function(err){
    if (err) { 
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
});


function loadProducts(){
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.table(res);
        propmtCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory){
    inquirer
    .prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID you want to buy? [Quite with Q]",
            validate:function {
                return !isNaN(val) || val.toLowerCase() === "q";
            }
        }
    ])
    .then(function(val){
        checkIfShouldExit(val.choice);
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);
        if (product){
            promptCustomerForQuantity(product);
        }
        else { 
            console.log("\nThat item is not in the inventory");
            loadProducts();
        }
    });
}

// product quantity

function promptCustomerForQuantity (product) { 
    inquirer
    .prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many would you like? [Quit with Q]",
            validate: function(val){
                return val > 0 || val.toLowerCase() === "q";
            }
        }
    ])
    .then(function(val){
        checkIfShouldExit(val.quantity);
        var quantity = parseInt(val.quantity);

        if (quantity > product.stock_quantity){
            console.log("\nInsufficient quantity!");
            loadProducts();
        }
        else {
            makePurchase(product,quantity);
        }
    });
}

