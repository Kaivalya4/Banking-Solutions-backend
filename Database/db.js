const {Client} = require('pg');
/*
const client  = new Client({
    host : "localhost",
    user : "postgres" , 
    port : 5432,
    password : "" ,
    database : "demo1"
})*/

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

client.connect();

module.exports = client;


