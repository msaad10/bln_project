const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');
const axios = require('axios');

const bcrypt = require('bcrypt');


//delete by data id
router.delete('/delete/:id', (req, res) => {
    let sql = `DELETE FROM data WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});



//get all data by user id
router.get('/getData/:id', (req, res) => {
    let sql = `SELECT * FROM data WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});


//login user
router.post('/login', (request, response) => {    
    var email = request.body.email;
    var password = request.body.password;
    
    if (email && password) {
        db.query('SELECT * FROM user WHERE email = ?', [email], function(err, result) {
            console.log(result[0].password)
            if (result.length > 0) {
                if(bcrypt.compareSync(password, result[0].password)) {

                        // Passwords match
                        
                            db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, result[0].password], function(err, results) {
                                
                                if (results.length > 0) {
                                    // request.session.loggedin = true;
                                    // request.session.email = email;
                                    delete results[0].password
                    
                                    response.send(results);
                                } else {
                                    // console.log("Incorrect Username and/or Password!");
                                    response.send('Incorrect Username and/or Password!');
                                }			
                                
                            });
                        
                        
                   } else {
                        response.send('Incorrect Username and/or Password!');
                   }
            }
            else
            {
                res.send("Email or Password incorrect")
            }
        })

    } 
    else 
    {
        response.send('Please enter Username and Password!');
    }
  	
});

