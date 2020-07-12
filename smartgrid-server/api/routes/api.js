const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');
const axios = require('axios');

const bcrypt = require('bcrypt');
const { result } = require('lodash');

var multer = require('multer')

//delete by data id
router.delete('/delete/:id', (req, res) => {
    let sql = `DELETE FROM data WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        if(results.affectedRows == 1)
        {
            results.message = "Success";
            res.status(200).json(   
                results
        );
        }
    });
});

//upload file
router.post('/uploadData/:userid', (req, res) => {
    console.log(req.body.companyName)
    if(req.body.description == '')
    {
        req.body.description = null;
    }
    let sql = `INSERT INTO data(user_id, company_name, description, hash, fileName, fileType) VALUES(?, '${req.body.companyName}', '${req.body.description}', '${req.body.fileHash}', '${req.body.fileName}', '${req.body.fileType}')`;
    let query = db.query(sql, [req.params.userid], (err, results) => {
        if (err) throw err;

        if(results.affectedRows == 1)
        {
            results.message = "Success";
                res.status(200).json(   
                    results
            );
        }
        
    });
});

router.post('/postRequest', (req, res) => {

    let sql = `INSERT INTO transaction(request_id, respondent_id, request_hash, is_request, verification, response_hash, time_stamp) VALUES('${req.body.request_id}', '${req.body.respondent_id}', '${req.body.request_hash}', 'true', null, null, null)`;
    let query = db.query(sql, [req.params.userid], (err, results) => {
        if (err) throw err;

        if(results.affectedRows == 1)
        {
            results.message = "Success";
                res.status(200).json(   
                    results
            );
        }
        
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file');

router.post('/sendFile', (req, res) => {

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            return res.status(200).send(req.file)

    })

    
    // let sql = `INSERT INTO transaction(request_id, respondent_id, request_hash, is_request, verification, response_hash, time_stamp) VALUES('${req.body.request_id}', '${req.body.respondent_id}', '${req.body.request_hash}', 'true', null, null, null)`;
    // let query = db.query(sql, [req.params.userid], (err, results) => {
    //     if (err) throw err;

    //     if(results.affectedRows == 1)
    //     {
    //         results.message = "Success";
    //             res.status(200).json(   
    //                 results
    //         );
    //     }
        
    // });
});

//update file
router.put('/updateData/:id', (req, res) => {
    if(req.body.description == '')
    {
        req.body.description = null;
    }
    let sql = `UPDATE data SET description = '${req.body.description}', hash = '${req.body.fileHash}', fileName = '${req.body.fileName}', fileType = '${req.body.fileType}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        
        if(results.affectedRows == 1)
        {
            results.message = "Success";
            res.status(200).json(   
                results,
        );
        }
    });
});



//get all data by user id
router.get('/getData/:id', (req, res) => {
    let sql = `SELECT * FROM data WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).json(
            results
        );
    });
});

//get all other user data
router.get('/getOtherData/:id', (req, res) => {
    let sql = `SELECT * FROM data WHERE user_id != ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).json(
            results
        );
    });
});

router.get('/getSendData/:id', (req, res) => {

    var obj=[];
    let sql = `SELECT * FROM transaction WHERE respondent_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;

        let sql1 = `SELECT * FROM user WHERE id= ${results[0].request_id}`;
        let query = db.query(sql1, (err, results1) => {
            if(err) throw err;

            delete results1[0].password;

            let sql2 = `SELECT * FROM data WHERE hash = '${results[0].request_hash}'`;
            let query = db.query(sql2, (err, results2) => {
                if(err) throw err;

                obj.push({transaction_data: results, user_data: results1, data: results2});
        
                
                res.status(200).json(
                    obj
                );

            })

            
            
           

        })

        
    });
});


//login user
router.post('/login', (request, response) => {   
    
    var email = request.body.email;
    var password = request.body.password;
    
    if (email && password) {       
        db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function(err, results) {
            
            if (results.length > 0) {
                // request.session.loggedin = true;
                // request.session.email = email;
                delete results[0].password

                response.send(results);
            } else {
                response.send('Incorrect Username and/or Password!');
            }			
            
        });

    } 
    else 
    {
        response.send('Please enter Username and Password!');
    }
  	
});


module.exports = router;