let mysql = require('mysql2');
// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'kartikkaushik9992474801@',
//     database: 'demo'

// })
// connection.connect(function(error){
//     if(error)throw error;
//     console.log("connected");

//     connection.query('select * from sign_up',(function(err,result){
//         if(err) throw err;
//         console.warn('all result here',result);
//     }))
// })

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kartikkaushik9992474801@',
    database: 'mydb'
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connected");
    // connection.query("CREATE DATABASE mydb", function(err,result){
    //     if(err) throw err;
    //     console.log("Database created");
    // });

    // var sql_01 = "CREATE TABLE customers(name VARCHAR(255), address VARCHAR(255))";
    // connection.query(sql,function(err,result){
    //     if(err) throw err;
    //     console.log("Table Created");
    // });

    // let sql_02 = "INSERT INTO customers (name,address) VALUES ('Kartikeya', 'Jhajjar')";
    // connection.query(sql_02,function(err, result){
    //     if(err) throw err;
    //     console.log("record inserted");
    // });
});