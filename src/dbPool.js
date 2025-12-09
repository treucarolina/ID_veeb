const mysql = require("mysql2/promise");

console.log("Andmebaasiserver: " + process.env.DB_HOST);
//Loome andmebaasi ühenduste pooli
const pool = await mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queLimit; 0
});

module.exports = pool;