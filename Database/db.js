const {Client} = require('pg');

const client  = new Client({
    host : "localhost",
    user : "postgres" , 
    port : 5432,
    password : "kt6819" ,
    database : "demo1"
})
client.connect();

module.exports = client;


