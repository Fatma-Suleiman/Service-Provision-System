const mysql = require('mysql2');
require('dotenv').config({ path: './.env' });

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'Z', // 👈 Force UTC for all connections
    connectionLimit: 10,
    multipleStatements: true,
    charset: 'utf8mb4'
    
  })
  .promise(); // <-- add promise() to expose .query()

module.exports = pool;