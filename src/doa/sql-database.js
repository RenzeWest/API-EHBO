// const express = require('express')
const sql = require('mssql');
require('dotenv').config();

const pool = new sql.ConnectionPool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT), // Het wordt opgeslagen als string in de .env, maar het moet een number zijn
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // for Azure SQL Database
        trustServerCertificate: true
    }
})

async function connectAndClose() {

    console.log(process.env.DB_PWD);
    console.log(typeof process.env.DB_PORT);
    console.log(process.env.DB_PORT);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_DATABASE);
    console.log(process.env.DB_SERVER);
    try {
        // Maak verbinding
        await pool.connect()
        console.log('verbonden met database')

        // Voer een query uit
        const result = await pool.request().query('SELECT * FROM Certificaat')
        console.log(result.recordset)
    } catch (error) {
        console.log(error)    
    } finally {
        pool.close(err => {
            if (err) {
                console.error('Er was een fout bij het sluiten van de connection pool:', err);
            } else {
                console.log('Connection pool gesloten');
            }
        });

    }

}

connectAndClose();


