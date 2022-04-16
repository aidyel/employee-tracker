USE employees_db;

INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales'),
('Security'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 9000, 1),
('Accountant', 7000, 2),
('Lawyer', 5000, 3),
('Manager', 7000, 4),
('Engineer', 9000, 5),
('Sales Rep', 4000, 6);

INSERT INTO employee (firs_name, last_name, role_id, manager_id)
VALUES
('John', 'Miller', 1, 678),
('Tyler', 'Allen', 2, 098),
('Ashley', 'Rodriguez', 3, 456),
('Martha', 'Wilson', 4, 234),
('Linda', 'Martin', 5, 724),
('Maria', 'Hall', 4, 126);