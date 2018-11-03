DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(9,2) NOT NULL,
  stock_quantity INT(10),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Matte Black iPhone Case", "Electronics", 11.50, 55), 
("Bamazon Balexa", "Electronics", 39.99, 0),
("Levi's", "Clothing", 49.99, 85), 
("T-Shirt", "Clothing", 19.95, 75), 
("Hunger Games", "Books", 11.99, 100),
("Brave New World", "Books", 7.99, 90),
("Baby Rattle", "Toys", 4.50, 55),
("Lego Batman", "Toys", 34.99, 85),
("Dog Food", "Pet_Supplies", 19.99, 95),
("Kitty Litter", "Pet_Supplies", 10.99, 105);
