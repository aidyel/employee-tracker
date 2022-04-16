// Dependecies 
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
const cTable = require('console.table');
const connection = require('./db/connection')

 
connection.connect(function (err) {
    if(err) throw err;
    promptMenu()
})




// Basic functionality of application
const promptMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "We have information on employees, departments, and employee roles. What would you like to do?",
                choices: [
                "View all department", 
                'view all roles', 
                'view all employes',
                 "Add a department",
                 'Add a role',
                 'Add an employee',
                 "Update employee",
                 'delete employee', 
                 'Exit']
            }
        ]).then(function (res) {
            switch (res.start) {
                case "View all department":
                    viewAlldepartment();
                    break;
                case "View all department":
                     viewAllRoles();
                    break;
                case "View all department":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                     break;
                case "Add an employee":
                    addEmployee();
                        break;
                case "Update":
                    updateEmployee();
                    break;
                case "Delete":
                    udeleteEmployee();
                    break;
                case "Exit":
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

const viewAlldepartment = () => {
    connection.query('SELECT * FROM department', (results) => {
        console.table(results);
        promptMenu();
    })
};

const viewAllRoles = () => {
    connection.query('SELECT * FROM role', (results) => {
        console.table(results);
        promptMenu();
    })
};

const viewAllEmployees = () => {
    connection.query('SELECT * FROM employee', (results) => {
        console.table(results);
        promptMenu();
    })
}


