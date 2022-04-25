// Dependecies 
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
const cTable = require('console.table');
const connection = require('./db/connection');



connection.connect(function (err) {

    if (err) throw err;
   
})



// Basic functionality of application
function promptMenu () {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "We have information on employees, departments, and employee roles. What would you like to do?",
                choices: [
                    { name: "View all department", value: 'view_departments' },
                    { name: 'view all roles', value: 'view_roles' },
                    { name: 'view all employees', value: 'view_employees' },
                    { name: "Add a department", value: 'add_department' },
                    { name: 'Add a role', value: 'add_role' },
                    { name: 'Add an employee', value: 'add_employee' },
                    { name: "Update employee role", value: 'update_employee' },
                    // { name: 'delete employee', value: 'delete_employee' },
                    { name: 'Exit', value: 'exit' }]
            }
        ]).then((res) => {
            let choice = res.choice;
            switch (choice) {
                case "view_departments":
                    viewAlldepartment();
                    break;
                case "view_roles":
                    viewAllRoles();
                    break;
                case "view_employees":
                    viewAllEmployees();
                    break;
                case "add_department":
                    addDepartment();
                    break;
                case "add_role":
                    addRole();
                    break;
                case "add_employee":
                    addEmployee();
                    break;
                case "update_employee":
                    updateEmployeeRole();
                    break;
                // case "delete_employee":
                //     deleteEmployee();
                //     break;
                case "exit":
                    console.log(`
          ===========================
                  All done!
         ===========================
          `);
                    break;
                default:
                    process.exit()

            }
        })
}



function init () {
    promptMenu()
}
init()

const viewAlldepartment = () => {

    connection.promise().query('SELECT department.id, department.name FROM department').then(([rows]) => {
        let departments = rows;
        console.table(departments)
    }).then(() => promptMenu())

};

const viewAllRoles = () => {

    connection.promise().query('SELECT role.id, role.title, role.salary FROM role').then(([rows]) => {
        let roles = rows;
        console.table(roles)
    }).then(() => promptMenu())
};

const viewAllEmployees = () => {

    connection.promise().query("SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;").then(([rows]) => {
        let employees = rows;
        console.table(employees)
    }).then(() => promptMenu())

};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'Name the department you would like to add',
            validate: departmentName => {
                if (departmentName) {
                    return true;
                } else {
                    console.log('Please enter the name of your department!');
                    return false;
                }
            }
        }
    ]).then(res => {
        console.log(res.depName)
        connection.promise().query(
            "INSERT INTO department (name) VALUES (?)", [res.depName]
        );
        promptMenu()
    })
};

const addRole = () => {
    return connection.promise().query(
        "  SELECT department.id, department.name FROM department;"
    )
        .then(([department]) => {
            let departmentChoice = department.map(({
                id,
                name
            }) => ({
                name: name,
                value: id
            }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the name of your title (Required)',
                    validate: titleName => {
                        if (titleName) {
                            return true;
                        } else {
                            console.log('Please enter title name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department are you from?',
                    choices: departmentChoice
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "Enter your salary (Required)",
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Please enter your salary!');
                            return false;
                        }
                    }
                }
            ]).then(({ title, department, salary }) => {
                const query = connection.promise().query(
                    'INSERT INTO role SET ?',
                    {
                        title: title,
                        department_id: department,
                        salary: salary
                    },
                    function (err, res) {
                        if (err) throw err;
                    }
                )
            }).then(() => viewAllRoles())
        })
};

const addEmployee = (roles) => {

    return connection.promise().query(
        "SELECT R.id, R.title FROM role R;"
    )
        .then(([employees]) => {
            let titleChoices = employees.map(({
                id,
                title
            }) => ({
                value: id,
                name: title
            }))

            connection.promise().query(
                "SELECT E.id, CONCAT(E.first_name, ' ', E.last_name) AS manager FROM employee E;"
            ).then(([manager]) => {
                let managerChoices = manager.map(({
                    id,
                    manager
                }) => ({
                    value: id,
                    name: manager
                }));

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name (Required',
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log('Please enter the employees first name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name (Required',
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log('Please enter employees last name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        choices: managerChoices
                    }
                ])
                    .then(({ firstName, lastName, role, manager }) => {
                        const query = connection.query(
                            'INSERT INTO employee SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log({ role, manager })
                            }
                        )
                    })
                    .then(() => viewAllEmployees())
            })
        })
};

const updateEmployeeRole = () => {
    return connection.promise().query(
        "SELECT R.id, R.title, R.salary, R.department_id FROM role R;"
    )
        .then(([roles]) => {
            let roleChoices = roles.map(({
                id,
                title
            }) => ({
                value: id,
                name: title
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role do you want top update?',
                    choices: roleChoices
                }
            ])
                .then(role => {
                    console.log(role);
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'Enter the name of your title (Required)',
                            validate: titleName => {
                                if (titleName) {
                                    return true;
                                } else {
                                    console.log('Please enter yoyr title name!');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter your salary (Required)',
                            validate: salary => {
                                if (salary) {
                                    return true;
                                } else {
                                    console.log('Please enter your salary!');
                                    return false;
                                }
                            }
                        }
                    ])
                        .then(({ title, salary }) => {
                            const query = connection.query(
                                'UPDATE role SET title = ?, salary = ? WHERE id = ?',
                                [
                                    title,
                                    salary,
                                    role.role
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                }
                            )
                        })
                        .then(() => promptMenu())
                })
        })
};


