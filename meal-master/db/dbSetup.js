const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'SecureDatabase05!',
    multipleStatements: true,
});

const databaseSQL = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
const tablesSQL = fs.readFileSync(path.join(__dirname, 'tables.sql'), 'utf8');

connection.query(databaseSQL, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      return connection.end();
    }
    console.log('Database created or already exists.');
  
    connection.query(tablesSQL, (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
      } else {
        console.log('Tables created successfully or already exist.');
      }
      connection.end();
    });
});