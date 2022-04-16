const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Am@zon20',
    database: 'employees_db'
});



module.exports = connection;