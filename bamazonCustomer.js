//require inquirer and mysql
var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config()

//connect to mysql database
var connection = mysql.createConnection({

  host: "localhost",
  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.SQL_PASS,
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw (err);
  showItems();
})


//this is where the app starts
function showItems() {
  //displaying all items from database
  connection.query("SELECT * FROM products", function (err, res) {

    //loop through to log the items, ids, and prices
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].item_id);
      console.log("Item: " + res[i].product_name);
      console.log("$" + res[i].price + "\n\n-----------------------\n");
    }

    //now that the items are printed, ask the user to select an item
    //using the ids listed above. They will then choose the quantity
    inquirer.prompt([
      {
        type: "input",
        name: "product_choice_id",
        message: "Input the ID of the product you would like to purchase:"
      },
      {
        type: "input",
        name: "product_quantity",
        message: "How many would you like to buy?"
      }
    ])
    //once the user has chosen a product, we will do the following
    .then(function (response) {

      //log the users choices back
      console.log("\n---------------------------\nYou have selected " + response.product_quantity + " " + res[response.product_choice_id - 1].product_name + "\n---------------------------\n");
      
      //ask them if this is what they really want
      inquirer.prompt([
        {
          type: "confirm",
          name: "confirm_product",
          message: "Do you want to continue?"
        }
      ])
      //then do the following
      .then(function (response_two) {

        //if their response if no, they do not want that product
        if (!response_two.confirm_product) {
          //end the app
          doneShopping();
        } 
        //otherwise continue on
        else {

          //if the user chooses a product with 0 quantity in stock
          //this needs to be updated so that instead of testing if the
          //quantity is 0, the 
          //res[response.product_choice_id - 1].stock_quantity - product_quantity
          //should be tested against 0
          if (res[response.product_choice_id - 1].stock_quantity - response.product_quantity <= 0) {
            console.log("\n---------------------------\nWe currently only have " + res[response.product_choice_id - 1].stock_quantity + " " + res[response.product_choice_id - 1].product_name + " in stock :( \nTry a lesser amount, or a different product.\n---------------------------\n");
            var showItemsAgain = setTimeout(showItems, 5000);
          } 
          //otherwise, if there is quantity
          else {
            var itemPrice = res[response.product_choice_id - 1].price * response.product_quantity
            //update the product in the database
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: res[response.product_choice_id - 1].stock_quantity - response.product_quantity
                },
                {
                  item_id: response.product_choice_id
                }
              ], 
              function (err, res) {
                
                //if there are any errors, show them
                if (err) throw (err);

                //log out a confirmation that the users transaction went through
                console.log("\n---------------------------\n---------------------------\n\nCongrats! Your items will arrive in 9999999 years!\nTotal Cost = $" + itemPrice + "\n\n---------------------------\n---------------------------\n");

                //then ask them if they would like to continue shopping
                inquirer.prompt([
                  {
                    type: "confirm",
                    name: "keep_shopping",
                    message: "Would you like to continue shopping?"
                  }
                ])
                //then do the following
                .then(function (response_three) {

                  //if the user responded yes, restart the app
                  if (response_three.keep_shopping) {
                    showItems();
                  } 
                  //otherwise, end the app
                  else {
                    doneShopping();
                  }
                })
              }
            )
          }
        }
      })
    })
  })
};

//function to end the app
function doneShopping() {

  //console log goodbye
  console.log("\n---------------------------\nGoodbye!\n---------------------------\n")
  
  //end the connection to database
  connection.end();
};
