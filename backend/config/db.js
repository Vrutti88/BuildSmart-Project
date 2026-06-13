const mysql = require("mysql2");

console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,

  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {

  if (err) {
    console.log("Database Error");
    console.log(err);
  } else {
    console.log("MySQL RDS Connected Successfully");
  }

});

module.exports = connection;