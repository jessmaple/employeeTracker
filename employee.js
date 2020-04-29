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
    SELECT concat(employee2.first_name,' ', employee2.last_name) manager, employee.first_name employee_first_name, employee.last_name employee_last_name FROM employee_DB.employee
    left join employee employee2 on employee.manager_id = employee2.id
     where employee.manager_id is not null order by concat(employee2.first_name,' ', employee2.last_name);
  `,
    function (err, data) {
      console.table(data);
      menu();
    }
  );
}

function lookup(tableName, columnName, customSelect) {
  return new Promise((resolve, reject) => {
    let sql = "";
    if (columnName.length === 0) {
      sql = customSelect;
    } else {
      sql = `select ${columnName} from ${tableName} order by ${columnName}`;
    }

    let statement = connection.query(sql, function (err, res) {
      resolve(res);
    });

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
          lookup(
            "role",
            "",
            `select id from role where title = "${input.role}"`
          ).then((results) => {
            console.log(results);
            console.log(results[0].id);

            var roleId = results[0].id;
            lookup(
              "employee",
              "",
              `select id from employee where concat(employee.first_name,' ', employee.last_name) = "${input.manager}"`
            ).then((results) => {
              console.log(results);
              console.log(results[0].id);
              var employeeId = results[0].id;

              connection.query(
                `
                 insert into employee(first_name, last_name, role_id, manager_id) values("${input.firstName}", "${input.lastName}", ${roleId}, ${employeeId})
                 `,
                function (err, data) {
                  menu();
                }
              );
            });
          });

          //  connection.query(`Insert Into employee ()`)
        });
    });
  });
}

function removeEmployee() {
  lookup(
    "employee",
    "",
    ` SELECT concat(employee.first_name,' ', employee.last_name) fullName from employee order by first_name; `
  ).then((results) => {
    let newResult = results.map((person) => {
      return person.fullName;
    });
    inquirer
      .prompt({
        type: "list",
        message: "Who do you want to remove?",
        choices: newResult,
        name: "employeeName",
      })
      .then((input) => {
        lookup(
          "employee",
          "",
          `SELECT id from employee where concat(employee.first_name,' ', employee.last_name) = "${input.employeeName}"`
        ).then((results) => {
          let id = results[0].id;
          connection.query(` DELETE from employee where id = ${id}`, function (
            err,
            res
          ) {
            menu();
          });
        });
      });
  });
}

function updateRole() {
  lookup(
    "employee",
    "",
    ` SELECT concat(employee.first_name,' ', employee.last_name) fullName from employee order by first_name; `
  ).then((results) => {
    let newResult = results.map((person) => {
      return person.fullName;
    });

    inquirer
      .prompt({
        type: "list",
        message: "which person do you want to update?",
        choices: newResult,
        name: "employee"
      })
      .then((input) => {
        lookup(
          "employee",
          "",
          ` SELECT id from employee where concat(employee.first_name,' ', employee.last_name) = "${input.employee}"`
        ).then((result) => {
          let employee_id = result[0].id;
          lookup("role", "title", ``).then((result) => {
            let newResult = result.map((role) => {
              return role.title;
            });

            inquirer
              .prompt({
                type: "list",
                message: "which role do you want to update?",
                choices: newResult,
                name: "title",
              })
              .then((input) => {
                lookup(
                  "role",
                  "",
                  ` SELECT id from role where title = "${input.title}"`
                ).then((result) => {
                  let role_id = result[0].id;
                  connection.query(
                    ` update employee set role_id = ${role_id} where id = ${employee_id}`,
                    function (err, res) {
                      menu();
                    }
                  );
                });
              });
          });
        });
      });
  });
}

// function updateManager() {}

// function viewAllRoles() {}

// function addRole() {}

// function removeRole() {}
