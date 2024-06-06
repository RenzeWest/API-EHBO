// const express = require('express')
const sql = require('mssql');
require('dotenv').config();
const logger = require('../util/logger');

const poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT), // Het wordt opgeslagen als string in de .env, maar het moet een number zijn
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // for Azure SQL Database
        trustServerCertificate: true
    }
}

const pool = new sql.ConnectionPool(poolConfig);

async function initializePool() {
    try {
        await pool.connect();
        logger.info('Database Connected');

        pool.on('error', err => {
            logger.error('Unexpected error on idle connection pool, error: ' + err)
        });
    } catch (error) {
        logger.error('Error connecting database: ' + error)
    }
}

initializePool();

module.exports = pool;
