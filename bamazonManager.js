//======================================= REQUIRE =========================================================
//require inquirer and mysql
var mysql = require("mysql");
var inquirer = require("inquirer");

//======================================= CONNECT =========================================================
//connect to mysql database
var connection = mysql.createConnection({

  host: "localhost",
  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "IHAZUnicorn",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw (err);
  showOptions();
})

//======================================= START APP =========================================================
//Begin the app by asking the manager what the would like to do
function showOptions() {
  inquirer.prompt([
    {
      type: "list",
      name: "menu_options",
      message: "Choose from the menu below:",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
  ])
    //once they respond
    .then(function (response) {

      //use a switch block to use the managers answer to trigger the
      //respective function to kick off
      switch (response.menu_options) {
        case "View Products for Sale":
          viewProduct();
          break;

        case "View Low Inventory":
          viewInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;
      }
    });

  //======================================= VIEW PRODUCT =========================================================
  //if the manager chooses to view all products
  function viewProduct() {

    //query from the database all products
    connection.query("SELECT * FROM products",

      //if there is an error, show it
      function (err, res) {

        if (err) throw (err);

        for (var i = 0; i < res.length; i++) {
          console.log("----------------------\n" + "ID: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nPrice: $" + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n----------------------");
        }

        inquirer.prompt([
          {
            type: "confirm",
            name: "continue",
            message: "Would you like to add a new product?"
          }
        ])
        .then(function (continue_response) {
          if (continue_response.continue) {
            addProduct();
          } else {
            console.log("goodbye");
            connection.end();
          }
      })
    })
  };

  //======================================= VIEW INVENTORY =========================================================
  //if the manager chooses to view all inventory
  function viewInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
      function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].product_name + "\n----------------------\n");
        }
      }
    )
  };

  //======================================= ADD INVENTORY =========================================================
  //if the manager chooses to add to inventory
  function addInventory() {
    connection.query("SELECT * FROM products",
      function (err, res) {

        if (err) throw (err);

        var results = [];

        for (var i = 0; i < res.length; i++) {
          results.push(res[i].product_name)
        }

        inquirer.prompt([
          {
            type: "list",
            name: "update_choice",
            message: "Which item would you like to add to?",
            choices: results
          }
        ]).then(function (results_two) {
          console.log(results_two.update_choice);
        })
      }
    )
  };

  //======================================= ADD PRODUCT =========================================================
  //if the manager chooses to add a product
  function addProduct() {
    connection.query("SELECT * FROM products",
      function (err, res) {

        if (err) throw (err);

        inquirer.prompt([
          {
            type: "input",
            name: "input_product",
            message: "Which product would you like to add?",
          }
        ]).then(function (results_three) {
          console.log(results_three);
        })
      }
    )

  };


}