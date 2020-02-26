DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE employee(
    id INT not null auto_increment,
    first_name varchar (30) not null, 
    last_name varchar (30) not null, 
    role_id int not null, 
    manager_id int, 
    PRIMARY KEY(id)
) ;

CREATE TABLE role (
    id INT not null auto_increment,
    title VARCHAR (30) not null,
    salary DECIMAL not null,
    department_id INT, 
    PRIMARY KEY(id)
);

CREATE TABLE department (
   id INT not null auto_increment,
   name VARCHAR(30),
   primary key (id)
); 
