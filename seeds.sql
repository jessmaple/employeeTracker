USE employee_DB;

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES   
  ("Jessica", "Maple", 1, NULL),
  ("John", "Doe", 2, 4),
  ("Mike", "Chan", 3, 2), 
  ("Ashley", "Rodriguez", 4, Null), 
  ("Kevin", "Tupik", 5, 4),
  ("Malia", "Brown", 6,  Null), 
  ("Sarah", "Lourd", 7, Null), 
  ("Tom", "Allen", 8, 7),
  ("Christian", "Eckenrode", 9, 3);

  INSERT INTO department (name) 
  VALUES ("Sales"),
         ("Engineering"),
         ("Legal");

   
INSERT INTO role (title, salary)
VALUES ("Sales Lead", 100000), 
        ("Salesperson", 80000),
        ("Lead Engineer", 150000),
        ("Software Engineer", 120000),
        ("Accountant", 125000),
        ("Legal Team Lead", 250000),
        ("Lawyer", 190000); 
    
    