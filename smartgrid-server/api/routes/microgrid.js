const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');
//const microgrid_details = require('../../models/microgrid-details');

// add a microgrid
router.post('/add', (req, res) => {

    var currentDate = new Date();
      
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var time = hours + ':' + minutes + ' ' + ampm

    var date = String(currentDate.getDate()).padStart(2, '0');
    var year = currentDate.getFullYear();
    var mon = String(currentDate.getMonth()+1).padStart(2, '0');


    console.log(year + "-" + mon + "-" + date);
    let post = {area: req.body.name, date: year + "-" + mon + "-" + date, time: time};
    let sql = 'INSERT INTO microgrid SET ?';

    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        res.status(201).json({
            message: 'Microgrid created',
            createdMicrogrid: post
        });
    });
});

//get all microgrids
router.get('/get', (req, res) => {
    let sql = 'SELECT * FROM microgrid';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});

router.get('/delete/:id', (req, res) => {
    let sql = 'DELETE FROM microgrid WHERE id = ?';
    let query = db.query(sql, [req.params.id], (err, results) => {
        if(err) throw err;
        // console.log(results);
        // res.status(200).json(
        //     results
        // );
    });
});



//get microgrid by id
router.get('/get/:id', (req, res) => {
    let res1 = null;
    let res2 = null;
    let res3 = null;
    let res4 = null;
    let res5 = null;
    let res6 = null;
    let res7 = null;
    let sql1 = `SELECT * FROM microgrid WHERE id = ${req.params.id}`;
    let sql2 = `SELECT count(*) as activeConsumers FROM prosumer WHERE microgrid_id = ${req.params.id} && is_active = 1`;
    let sql3 = `SELECT count(*) as inactiveConsumers FROM prosumer WHERE microgrid_id = ${req.params.id} && is_active = 0`;
    let sql4 = `SELECT count(*) as activeProducers FROM prosumer WHERE microgrid_id = ${req.params.id} && is_producer = 1 && is_active = 1`;
    let sql5 = `SELECT count(*) as inactiveProducers FROM prosumer WHERE microgrid_id = ${req.params.id} && is_producer = 1 && is_active = 0`;
    let sql6 = `SELECT sum(units_consumed) as unitsConsumed FROM consumption WHERE microgrid_id = ${req.params.id}`;
    let sql7 = `SELECT sum(produced_units) as unitsProduced FROM production WHERE microgrid_id = ${req.params.id}`;
    
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
                            let query7 = db.query(sql7, (err7, result7) => {
                                if(err7) throw err7;
                                res7 = result7;
                                send = {
                                    "id" : res1[0].id,
                                    "area" : res1[0].area,
                                    "date" : res1[0].date,
                                    "time" : res1[0].time,
                                    "activeConsumers" : res2[0].activeConsumers,
                                    "inactiveConsumers" : res3[0].inactiveConsumers,
                                    "activeProducers" : res4[0].activeProducers,
                                    "inactiveProducers" : res5[0].inactiveProducers,
                                    "unitsConsumed" : res6[0].unitsConsumed,
                                    "unitsProduced" : res7[0].unitsProduced,
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