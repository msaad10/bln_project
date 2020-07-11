const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');

router.post('/login', (request, response) => {
  var email = request.body.email;
 var password = request.body.password;
   
 if (email && password) {
   db.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], function(err, result) {
     
           if (result.length > 0) {
       // request.session.loggedin = true;
       // request.session.email = email;

       delete result[0].password;
       response.send(result);
     } else {
       response.send('Incorrect Username and/or Password!');
     }			
     
   });
 } else {
   response.send('Please enter Username and Password!');
 }
});

router.post('/signup', (req, res) => {
    var user={
        "first_name":req.body.first_name,
        "last_name":req.body.last_name,
        "email":req.body.email,
        "password":req.body.password,
        "created":today,
        "modified":today
      }

    connection.query('INSERT INTO users SET ?',user, function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          res.send({
            "code":200,
            "success":"user registered sucessfully"
              });
        }
        });
});

module.exports = router;

