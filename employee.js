var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("connection id", connection.threadId);
  menu();
});

// function
function menu() {
  inquirer
    .prompt([
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
          "remove role",
        ],
        name: "menuList",
      },
    ])
    .then(function (input) {
      console.log(input.menuList);

      switch (input.menuList) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View All employees by deparment":
          byDepartment();
          break;
        case "View all employees by manager":
          byManager();
          break;
        case "add employee":
          addEmployee();
          break;
        case "remove employee":
          removeEmployee();
          break;
        case "Update employee role":
          updateRole();
          break;
        case "update employee manager":
          updateManager();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "add role":
          addRole();
          break;
        case "remove role":
          removeRole();
      }
    });
}
function viewAllEmployees() {
  connection.query(
    `
SELECT A.id, A.first_name, A.last_name, C.title, concat_ws(' ',nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' ))  manager  
FROM employee A 
left join employee B   on A.manager_id=B.id 
left join role C on A.role_id = C.id
`,
    function (err, data) {
      console.table(data);
      menu();
    }
  );
}

function byDepartment() {
  connection.query(
    `
SELECT A.id, A.first_name, A.last_name, C.title,D.name department, concat_ws(' ',nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' ))  manager  
FROM employee A 
left join employee B   on A.manager_id=B.id 
left join role C on A.role_id = C.id
left join department D on C.department_id=D.id order by department
`,
    function (err, data) {
      console.table(data);
      menu();
    }
  );
}

function byManager() {
  connection.query(
    `
  SELECT A.id, A.first_name, A.last_name, C.title, E.manager name, concat_ws(' ' ,,nullif(B.first_name,' ' ) , nullif(B.last_name, ' ' )) manager 
  FROM employee A
  left join employee B   on A.manager_id=B.id 
  left join role C on A.role_id = C.id
  left join manager E on a.role_id = C.id order by manager 
  `,
    function (err, data) {
      console.table(data);
      menu();
    }
  );
}

function lookup(tableName, columnName, customSelect) {
  return new Promise((resolve, reject) => {
      let sql = ""
     if (columnName.length===0){
       sql=customSelect

     }
     else{
     sql=`select ${columnName} from ${tableName} order by ${columnName}`
     }


    let statement = connection.query(
      sql
      ,
      function (err, res) {
        resolve(res);
      }
    );

    console.log(statement.sql);
  });
}

function addEmployee() {
  lookup("role", "title", "").then((role) => {
    console.log(role);
    let newRole = role.map((role) => {
      return role.title;
    });

    lookup(
      "employee",
      "",
      `SELECT concat(employee2.first_name,' ', employee2.last_name) name FROM employee_DB.employee
    left join employee employee2 on employee.manager_id = employee2.id
     where employee.manager_id is not null;`
    ).then((manager) => {
      console.log(manager);
      let newManager = manager.map((manager) => {
        return manager.name;
      });

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is your first name?",
            name: "firstName",
          },
          {
            type: "input",
            message: "What is your last name?",
            name: "lastName",
          },
          {
            type: "list",
            message: "Choose your role",
            name: "role",
            choices: newRole,
          },
          {
            type: "list",
            message: "Who is employee's manager?",
            choices: newManager,
            name: "manager",
          },
        ])
        .then((input) => {
          console.log(
            input.firstName,
            input.lastName,
            input.role,
            input.manager
          );
          // lookup("role", "id")

          //  connection.query(`Insert Into employee ()`)
        });
    });
  });
}

function removeEmployee() {}

function updateRole() {}

function updateManager() {}

function viewAllRoles() {}

function addRole() {}

function removeRole() {}
