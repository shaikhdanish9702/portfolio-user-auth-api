const mysql = require('mysql2/promise')
const logger = require('winston')
require('dotenv').config()
const dbName = process.env.DB_NAME || 'profile_service'

mysql
  .createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root'
  })
  .then((connection) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`).then((res) => {
      logger.info('Database create or successfully checked')
      process.exit(0)
    })
  })
