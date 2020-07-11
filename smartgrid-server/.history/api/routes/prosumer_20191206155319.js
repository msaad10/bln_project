const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');

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

router.post('/add', (req, res) => {
    let post = { name: req.body.name, address: req.body.address, microgrid_id: req.body.microgrid_id, meter_no: req.body.meter_no,  der_id: 1, email: req.body.email, password: req.body.password };
    // Todo: test with fregin key adding
    let sql = 'INSERT INTO prosumer SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.status(201).json({
            message: 'Prosumer created',
            createdProsumer: post
        });
    });
});

//get all microgrids
router.get('/get', (req, res) => {
    let sql = 'SELECT * FROM prosumer';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(results
        );
    });
});

//get microgrid by id
router.get('/get/:id', (req, res) => {
    let sql = `SELECT * FROM prosumer WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.status(200).json({
            prosumer: result
        });
    });
});

router.post('/login', (req, res) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        let sql = `SELECT * FROM accounts WHERE username = ${username} AND password = ${password}`;
        db.query(sql, function (error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
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