var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'bamazon'
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Welcome to Bamazon!");
    createTable(); 
})

var createTable = function() {
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++) {
            console.log(res[i].itemid+" \\ "
            +res[i].productname+" \\ "+res[i].deparmentname+" \\ "
            +res[i].price+" \\ "+res[i].stockquantity+"\n");
        }
    promptCustomer(res);
    })
}

var promptCustomer = function(res) {
    // Asking costumer to purchase an item
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Purchase an item. [Exit with E]'
    }]).then(function(answer) {
        var correct=false;
        if(answer.choice.toUpperCase()==="E"){
            process.exit();
        }
        for(var i=0; i<res.length; i++) {
            // if name of product in the stock matches the user's input setting th correct variable to true
            if(res[i].productname==answer.choice){
                correct = true;
                var product=answer.choice;
                var id = i;
                inquirer.prompt({
                    // asking costumer for the quantity of the items to be purchased
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you prefer to purchase?',
                    validate: function(value) {
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    // calculating the remaining ammount of items in stock
                    if((res[id].stockquantity-answer.quantity)>0){
                        // displaying the number of the items left in stock
                        connection.query("Product quantity in stock is'"+res[id].stockquantity-
                        answer.quant)+"' productname='"+product+"'", function(err, res2){
                            console.log("Product Purchased!");
                            createTable();
                        }
                } else {
                    console.log("Incorrect. Try to purchase again!");
                    promptCustomer(res);
                    }
                })
            }
        }
        if(i==res.length && correct==false){
            console.log("Invalid Choice!");
            promptCostumer(res);
        }    
    })
}