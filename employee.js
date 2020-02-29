var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
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

      switch(input.menuList){
        case "View all employees": 
        viewAllEmployees()
        break
        case "View All employees by deparment":
          byDepartment()
        break
        case "View all employees by manager":
          byManager()
        break
        case "add employee":
          addEmployee()
        break
        case "remove employee":
          removeEmployee()
        break
        case "Update employee role":
          updateRole()
        break
        case "update employee manager":
          updateManager()
        break
        case "view all roles":
          viewAllRoles()
        break
        case "add role":
          addRole()
        break
        case "remove role":
          removeRole()
      }
    
  })
}
function viewAllEmployees(){
connection.query(`
SELECT A.id, A.first_name, A.last_name, C.title, concat_ws(' ',nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' ))  manager  
FROM employee A 
left join employee B   on A.manager_id=B.id 
left join role C on A.role_id = C.id
`, function(err, data){
console.table(data)
menu()

})
}

function  byDepartment(){
connection.query(`
SELECT A.id, A.first_name, A.last_name, C.title,D.name department, concat_ws(' ',nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' ))  manager  
FROM employee A 
left join employee B   on A.manager_id=B.id 
left join role C on A.role_id = C.id
left join department D on C.department_id=D.id order by department
`, function(err, data){
  console.table(data)
  menu()
})
}

function  byManager(){
  connection.query(`
  SELECT A.id, A.first_name, A.last_name, C.title, E.manager name, concat_ws(' ' ,,nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' )) manager 
  FROM employee A
  left join employee B   on A.manager_id=B.id 
  left join role C on A.role_id = C.id
  left join manager E on a.role_id = C.id order by manager 
  `, function(err, data){
    console.table(data)
    menu()
  `)

}

function   addEmployee(){

}

function  removeEmployee(){

}

function updateRole(){

}

function  updateManager(){

}

function viewAllRoles(){

}

function addRole(){

}

function removeRole() {

}

