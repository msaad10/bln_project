const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');
const axios = require('axios');

const bcrypt = require('bcrypt');

// add a prosumer
// router.post('/add', (req, res) => {
//     let post = { name: req.body.name, address: req.body.address, microgrid_id: req.body.microgrid_id, meter_no: req.body.meter_no, price_per_unit: req.body.price_per_unit, der_id: req.body.der_id, start_date: req.body.start_date, email: req.body.email, password: req.body.password, is_producer: req.body.is_producer, is_seller: req.body.is_seller };
//     let sql = 'INSERT INTO prosumer SET ?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.status(201).json({
//             message: 'Prosumer created',
//             createdProsumer: post
//         });
//     });
// });


//delete by prosumer id
router.delete('/delete/:id', (req, res) => {
    let sql = `DELETE FROM prosumer WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});



//get all consumers by microgrid id
router.get('/getConsumersByMicrogridId/:id', (req, res) => {
    let sql = `SELECT * FROM prosumer WHERE microgrid_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});

//get all producers by microgrid id
router.get('/getProducersByMicrogridId/:id', (req, res) => {
    let sql = `SELECT * FROM prosumer WHERE microgrid_id = ${req.params.id} AND is_producer = 1`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});

router.post('/add', (req, res) => {

    console.log(req.body.length)
    console.log(req.body[0]);
    console.log(req.body[1]);
    for(var i=0; i< req.body.length; i++)
    {   
    
       // bcrypt.hash(req.body[i].password, 10, function(err, hash) {
            // Store hash in database

            var hash = bcrypt.hashSync(req.body[i].password, 10);
            let post = { name: req.body[i].name, address: req.body[i].address, phone: req.body[i].phone, microgrid_id: req.body[i].microgrid_id, start_date:req.body[i].start_date, meter_no: req.body[i].meter_no,  der_id: req.body[i].der_id, email: req.body[i].email, password: hash, is_producer: req.body[i].is_producer, is_seller: req.body[i].is_seller, is_active: req.body[i].is_active };
            // Todo: test with fregin key addingstart
            let sql = 'INSERT INTO prosumer SET ?';
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                id = String(result.insertId);
            });
      //    });

        

        // setTimeout(() => {
        //     axios.post('http://192.168.131.131:3000/api/Trader', {
        //         "$class": "org.example.mynetwork.Trader",
        //         "traderId": pid,
        //         "name": req.body[i].name
        //     })
        //     .then(function (response) {
        //         console.log("success");
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //         res.status(400).json({
        //             message: error,
        //         });
        //         console.log("error");
        //     });
        // }, 500);

    }

    res.status(201).json({
        message: 'Prosumers Added',
    });
   
    
});

//get all prosumers
router.get('/get/consumer', (req, res) => {
    let sql = 'SELECT * FROM prosumer';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});


//get all prosumers
router.get('/get', (req, res) => {
    let sql = 'SELECT * FROM prosumer WHERE is_producer = 1';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});

//get prosumer by id
router.get('/get/:id', (req, res) => {
    let sql = `SELECT * FROM prosumer WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);

        let sql2 = `SELECT * FROM der WHERE id = ${result[0].der_id}`;

        let query2 = db.query(sql2, (err2, result2) => {
            if (err2) throw err2;
            //console.log(result2);
            send = {
                'id':result[0].id,
                'name':result[0].name,
                'address':result[0].address,
                'phone':result[0].phone,
                'microgrid_id':result[0].microgrid_id,
                'meter_no':result[0].meter_no,
                'price_per_unit':result[0].price_per_unit,
                'der_id':result[0].der_id,
                'start_date':result[0].start_date,
                'email':result[0].email,
                'is_producer':result[0].is_producer,
                'is_seller':result[0].is_seller,
                'is_active':result[0].is_active,
                'der_no':result2[0].der_no,
                'der_type':result2[0].type,
            };
            res.status(200).send(
                send
            );
        });
        
    });
});

//get transaction by id
router.get('/getTransaction/:id', (req, res) => {
    let sql = `SELECT * FROM transaction WHERE id = ?`;
    let query = db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;

        res.status(200).send(
            result
        );        
        
    });
});


//get prosumer by email
router.get('/getByEmail/:email', (req, res) => {

    let query = db.query( 'SELECT * FROM prosumer WHERE email = ?', [req.params.email], (err, result) => {
        if (err) throw err;
        //console.log(result);

        let sql2 = `SELECT * FROM der WHERE id = ${result[0].der_id}`;

        let query2 = db.query(sql2, (err2, result2) => {
            if (err2) throw err2;
            //console.log(result2);
            send = {
                'id':result[0].id,
                'name':result[0].name,
                'address':result[0].address,
                'microgrid_id':result[0].microgrid_id,
                'meter_no':result[0].meter_no,
                'price_per_unit':result[0].price_per_unit,
                'der_id':result[0].der_id,
                'start_date':result[0].start_date,
                'email':result[0].email,
                'is_producer':result[0].is_producer,
                'is_seller':result[0].is_seller,
                'is_active':result[0].is_active,
                'der_no':result2[0].der_no,
                'der_type':result2[0].type,
                'phone_no': result[0].phone
            };
            res.status(200).send(
                send
            );
        });
        
    });
});
router.post('/login', (request, response) => {    
    var email = request.body.email;
    var password = request.body.password;
    
    if (email && password) {
        db.query('SELECT * FROM prosumer WHERE email = ?', [email], function(err, result) {
            console.log(result[0].password)
            if (result.length > 0) {
                if(bcrypt.compareSync(password, result[0].password)) {

                        // Passwords match
                        
                            db.query('SELECT * FROM prosumer WHERE email = ? AND password = ?', [email, result[0].password], function(err, results) {
                                
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


router.post('/loginUser', (request, response) => {
    var email = request.body.email;
     var password = request.body.password;
     console.log(email)
     console.log(password)
     if (email && password) {
         db.query('SELECT * FROM prosumer WHERE email = ? AND password = ?', [email, password], function(err, result) {
             
             if (result.length > 0) {
                 // request.session.loggedin = true;
                 // request.session.email = email;
                 response.send(result);
             } else {
                 // console.log("Incorrect Username and/or Password!");
                 response.send({error:'' });
             }			
             
         });
     }
 });


// get  Consumption
router.get('/get/consumption_data/:id', (req, res) => {
    let sql1 = `select * from consumption WHERE prosumer_id = ${req.params.id} order by date , time desc` ;
    db.query(sql1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

// get  Consumption
router.get('/get/liveconsumption/:email', (req, res) => {
    let date_ob = new Date();
    // current hours

    array = [];

     let sql1 = 'select * from prosumer WHERE email = ?';
    db.query(sql1, [req.params.email], (err, result) => {
        if(err) throw err;

        let sql2 = `SELECT * FROM (SELECT * FROM consumption WHERE prosumer_id = ${result[0].id} ORDER BY id DESC LIMIT 6) sub ORDER BY id ASC`;

        db.query(sql2, (err, result2) => {

            if(err) throw err;
            
            res.status(200).json(result2);
        });
    });
});
router.get('/get/live_data/:id', (req, res) => {
    let sql1 = `select units_consumed from consumption WHERE prosumer_id = ${req.params.id} order by id desc limit 1` ;
    db.query(sql1, (err, result) => {
        if(err) throw err;
        let sql2 = `select produced_units from production WHERE prosumer_id = ${req.params.id} order by id desc limit 1` ;
        db.query(sql2, (err, result1) => {
            console.log(result);
            console.log(result1);
            res.status(200).json([result1, result]);
        });
        
    });
});


router.get('/get/production_data/:id', (req, res) => {
    let sql1 = `select * from production WHERE prosumer_id = ${req.params.id} order by date , time desc`;
    db.query(sql1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

router.get('/getbillbymonth/:email/:billmonth', (req, res) => {

    returnObject= {};
    let sql = 'SELECT * FROM prosumer WHERE email = ?';
    let query = db.query(sql, [req.params.email], (err, results) => {
        if(err) throw err;

        
        if(results.length != 0 )
        {
            returnObject["prosumer_id"] = results[0].id;
            returnObject["microgrid_id"] = results[0].microgrid_id;
            returnObject["meter_no"] = results[0].meter_no;
            returnObject["der_id"] = results[0].der_id;
    
            let sql1 = `select * from bill WHERE prosumer_id = ${results[0].id} AND month = ?`;
            db.query(sql1, [req.params.billmonth], (err, result) => {
                
                if(err) throw err;
    
                if(result.length != 0 )
                {
                    returnObject["bill_amount"] = result[0].bill_amount;
                    returnObject["units_consumed"] = result[0].units_consumed;
                    res.status(200).json(returnObject);
                }
                else
                {
                    res.status(200).json("No Bill Found")
                }
                
    
            });
        }
        

    });
    
});

router.get('/getProsumers/:id', (req, res) => {
    let sql = 'SELECT * FROM prosumer WHERE microgrid_id = ?';
    let query = db.query(sql, [req.params.id], (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});





router.post('/set/rates', (req, res) => {
    //console.log("iii")
    
    let query = db.query( 'UPDATE prosumer SET price_per_unit = ? WHERE email = ?', [req.body.rate, req.body.email], (err, result) => {
        if (err) throw err;
        
        let sql = `SELECT price_per_unit FROM prosumer WHERE email = ?`;
        let query = db.query(sql, [req.body.email], (err, results) => {
            if(err) throw err;

            res.status(200).json(
                results
            );
        });
    
    });
});

router.post('/set/sellrates/:id', (req, res) => {
    // console.log("iii");
    sql = `UPDATE prosumer SET price_per_unit = ${req.body.rate} WHERE id = ${req.params.id}`;
    console.log(sql);
    let query = db.query( sql, (err, result) => {
        if (err) throw err;
        
        //console.log(result2);
    
            res.status(200).send(
                result
            );
    });
});
        
router.get('/get/transaction_data/:id', (req, res) => {
    let sql1 = `select * from transaction WHERE seller_id = ${req.params.id} and type = "Sell" order by date DESC`;
    db.query(sql1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});
router.get('/get/bill_data/:id', (req, res) => {
    let sql1 = `select * from bill WHERE prosumer_id = ${req.params.id} order by date  desc`;
    db.query(sql1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

//get prosumer data weekly
router.get('/get/prosumer_weekly/:id', (req, res) => {
    let sql = `select * from (SELECT sum(production.produced_units) produced_units, date FROM production WHERE prosumer_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let sql1 = `select units_consumed from (SELECT sum(units_consumed) units_consumed,date FROM consumption WHERE prosumer_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let sql2 = `select units_sold from (SELECT sum(units) units_sold,date FROM transaction WHERE seller_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let query1 = db.query(sql1, (err, result) => {
        if(err) throw err;
        res1 = result
        let query2 = db.query(sql2, (err, result) => {
            if(err) throw err;
            res2 = result
            // res1 = result1
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                // result = Object.values(result)
                console.log(result);
                var produced_arr= [];
                var date_arr= [];
                var consumed_arr=[];
                var sold_arr=[];
                // console.log(res1)
                for ( i in result){
                    // console.log(i)
                    produced_arr.push(result[i]["produced_units"]);
                    // console.log(result[i]["date"].getDate()+'/'+(result[i]["date"].getDate()+1));
                    consumed_arr.push(res1[i]['units_consumed']);
                    sold_arr.push(res2[i]['units_sold']);
                    date_arr.push(result[i]["date"].getDate()+'/'+(result[i]["date"].getMonth()+1));
                }
        
                console.log(produced_arr);
                res.status(200).json({  produced_units:produced_arr,date:date_arr,sold_units:sold_arr,units_consumed:consumed_arr});
            });
            
        });
    });
    
});

router.get('/get/prosumer_monthly/:id', (req, res) => {
    let sql = `select * from (SELECT sum(production.produced_units) produced_units, date FROM production WHERE prosumer_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let sql1 = `select units_consumed from (SELECT sum(units_consumed) units_consumed,date FROM consumption WHERE prosumer_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let sql2 = `select units_sold from (SELECT sum(units) units_sold,date FROM transaction WHERE seller_id = ${req.params.id}
     group by date order by date desc limit 7) var order by date`;
    let query1 = db.query(sql1, (err, result) => {
        if(err) throw err;
        res1 = result
        let query2 = db.query(sql2, (err, result) => {
            if(err) throw err;
            res2 = result
            // res1 = result1
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                // result = Object.values(result)
                console.log(result);
                var produced_arr= [];
                var date_arr= [];
                var consumed_arr=[];
                var sold_arr=[];
                // console.log(res1)
                for ( i in result){
                    // console.log(i)
                    produced_arr.push(result[i]["produced_units"]);
                    // console.log(result[i]["date"].getDate()+'/'+(result[i]["date"].getDate()+1));
                    consumed_arr.push(res1[i]['units_consumed']);
                    sold_arr.push(res2[i]['units_sold']);
                    date_arr.push(result[i]["date"].getDate()+'/'+(result[i]["date"].getMonth()+1));
                }
        
                console.log(produced_arr);
                res.status(200).json({  produced_units:produced_arr,date:date_arr,sold_units:sold_arr,units_consumed:consumed_arr});
            });
            
        });
    });
    
});


router.post('/signup', (req, res) => {
    var user = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today,
        "modified": today
    }

    connection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            res.send({
                "code": 200,
                "success": "user registered sucessfully"
            });
        }
    });
});

router.get('/get/dashboarddata/getAll', (req, res) => {
    let res1 = null;
    let res2 = null;
    let res3 = null;
    let res4 = null;
    let res5 = null;
    let res6 = null;
    let sql1 = 'SELECT count(*) as activeConsumers FROM prosumer WHERE is_active = 1';
    let sql2 = 'SELECT count(*) as inactiveConsumers FROM prosumer WHERE is_active = 0';
    let sql3 = 'SELECT count(*) as activeProducers FROM prosumer WHERE is_producer = 1 AND is_active = 1';
    let sql4 = 'SELECT count(*) as inactiveProducers FROM prosumer WHERE is_producer = 1 AND is_active = 0';
    let sql5 = 'SELECT sum(units_consumed) as unitsConsumed FROM consumption';
    let sql6 = 'SELECT sum(produced_units) as unitsProduced FROM production';
    
    let query1 = db.query(sql1, (err1, result1) => {
        if(err1) throw err1;
        res1 = result1
        let query2 = db.query(sql2, (err2, result2) => {
            if(err2) throw err2;
            res2 = result2;
            let query3 = db.query(sql3, (err3, result3) => {
                if(err3) throw err3;
                res3 = result3;
                let query4 = db.query(sql4, (err4, result4) => {
                    if(err4) throw err4;
                    res4 = result4;
                    let query5 = db.query(sql5, (err5, result5) => {
                        if(err5) throw err5;
                        res5 = result5;
                        let query6 = db.query(sql6, (err6, result6) => {
                            if(err6) throw err6;
                            res6 = result6;
                                send = {
                                    "activeConsumers" : res1[0].activeConsumers,
                                    "inactiveConsumers" : res2[0].inactiveConsumers,
                                    "activeProducers" : res3[0].activeProducers,
                                    "inactiveProducers" : res4[0].inactiveProducers,
                                    "unitsConsumed" : res5[0].unitsConsumed,
                                    "unitsProduced" : res6[0].unitsProduced,
                                };
                                res.status(200).json(
                                    send
                                );
                            }); 
                        }); 
                    }); 
                });
            });
        });
    });


module.exports = router;

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Handling GET request to /products'
//     });
// });

// router.get('/:productId', (req, res, next) => {
//     const id = req.params.productId;
//     if (id === 'special') {
//         res.status(200).json({
//             message: 'You discovered the special ID',
//             id: id
//         });
//     } else {
//         res.status(200).json({
//             message: 'You passed an ID'
//         });
//     }
// });

// router.patch('/:productId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Updated product!'
//     });
// });

// router.delete('/:productId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Deleted product!'
//     });
// });