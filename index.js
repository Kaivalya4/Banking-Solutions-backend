const express = require('express');
const db = require('./Database/db');
const cors = require('cors');
const multer = require('multer');  ///for fomr having multiple fields 
const { response } = require('express');

const upload = multer();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('pulbic'));

app.get('/all' , (req,res) =>{
         db.query('SELECT * FROM customers' , (err,response) => {
            if(err)
                throw err;
            res.json(response.rows);    
        })
})

app.put('/:accno' , (req,res) => {
    db.query(`SELECT * FROM customers WHERE account_number = CAST(${(req.params.accno)} AS VARCHAR)` , (err,response) => {
        if(err)
            throw err;
        res.json(response.rows);
    })
})

app.post('/transfer' ,(req,res) => {
    let from = req.body.from;
    let to = req.body.to;
    let amount = req.body.amount;
    let mark = true;
    db.query(`SELECT count(*) FROM customers WHERE account_number = ${from}::VARCHAR OR account_number = ${to}::VARCHAR` , (err,response) => {
        if(parseInt(response.rows[0].count) != 2){
            mark = false;
        }
        if(mark){
            db.query(`UPDATE customers SET balance = balance - CAST(${amount} AS NUMERIC(12,2)) WHERE account_number = ${from}::VARCHAR` , (err, response) =>{
            if(err)
                throw err;
            })
            db.query(`UPDATE customers SET balance = balance + CAST(${amount} AS NUMERIC(12,2)) WHERE account_number = ${to}::VARCHAR` , (err, response) =>{
            if(err)
                throw err;
            })
            db.query(`INSERT INTO transactions VALUES (${from}::VARCHAR , ${to}::VARCHAR , to_timestamp(${Date.now()} /1000.0) , ${amount}::NUMERIC(12,2) )` , (err,response) =>{
            if(err)
                throw err;
            });
        }
    })
    res.redirect('http://127.0.0.1:5500/Banking%20Application/FrontEnd/Pages/Customer.html');
} )

app.get('/details/:acc' , (req,res) => {
    let acc = req.params.acc;
    console.log(acc);
    db.query(`SELECT * FROM transactions WHERE from_account = CAST(${acc} AS VARCHAR) OR to_account = ${acc}:: VARCHAR` , (err,response) => {
        if(err)
            throw err;
        console.log(response.rows);
        res.json(response.rows);
    })
    
})

const PORT = process.env.PORT || 5000;
app.listen(PORT , function (){
    console.log(`Server started at ${PORT}`);
});


