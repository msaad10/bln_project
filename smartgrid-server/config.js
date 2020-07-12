const mysql = require('mysql');
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'dataledger'
});

//connect
db.connect((err) => {
    if(err) throw err;
    console.log('My Sql connected...');
});

module.exports = db;