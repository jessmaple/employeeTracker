var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_DB"
});

connection.connect(function(err) {
  if (err) {
    console.log(err);
  }
  console.log("connection id", connection.threadId);
  menu();
});

// function
function menu() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View All employees by deparment",
        "View all employees by manager",
        "add employee",
        "remove employee",
        "Update employee role",
        "update employee manager",
        "view all roles",
        "add role",
        "remove role"
      ], 
      name: "menuList"
    }
  ]).then(function(input){
      console.log(input.menuList)
  })
}
