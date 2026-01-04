const { Pool } = require('pg');
require('dotenv').config();

module.exports = new Pool({
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
});