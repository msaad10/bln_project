const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');
const axios = require('axios');


//add TRANSACTION data
router.post('/transaction', (req, res) => {
    var data = {
        "$class": "org.example.mynetwork.Trade",
        "commodity": req.body.commodity,
        "newOwner": req.body.newOwner
    }
    
    var myJSON = JSON.stringify(data);
    console.log(data);

    // blockchain_url = 'http://192.168.131.129:3000/api';

    axios.post('http://192.168.131.131:3000/api/Trade', data)
      .then(function (response) {
        // console.log(response.data.transactionId);
        if(req.body.type == "1")
        {
            var data2 = {
                "id": response.data.transactionId,
                "buyer_id": "1",
                "seller_id": req.body.prosumer_id,
                "units": req.body.units,
                "per_unit_price": 1,
                "type": "Sell",
                "date": req.body.date,
                "time": req.body.time,
            }

            console.log(data2);
    
            let sql = 'INSERT INTO transaction SET ?';
            let query = db.query(sql, data2, (err, result) => {
                if(err) throw err;
                console.log(result);
                res.status(201).json({
                    message: 'Data Added',
                });
            });
        }
        else if(req.body.type == "2")
        {
            var data2 = {
                "id": response.data.transactionId,
                "buyer_id": req.body.prosumer_id,
                "seller_id": "1",
                "units": req.body.units,
                "per_unit_price": 1,
                "type": "Bought",
                "date": req.body.date,
                "time": req.body.time,
            }
    
            console.log(data2);

            let sql = 'INSERT INTO transaction SET ?';
            let query = db.query(sql, data2, (err, result) => {
                if(err) throw err;
                console.log(result);
                res.status(201).json({
                    message: 'Data Added',
                });
            });
        }

      })
      .catch(function (error) {
        console.log(error);
            res.status(400).json({
                message: error,
            });
            console.log("error");
      });
});

//add consumption data
router.post('/consumption', (req, res) => {
    var data = {
        "prosumer_id": req.body.prosumer_id,
        "microgrid_id": req.body.microgrid_id,
        "units_consumed": req.body.units_consumed,
        "date": req.body.date,
        "time": req.body.time,
    }
    
    let sql = 'INSERT INTO consumption SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(201).json({
            message: 'Data Added',
        });
    });
});

//add production data
router.post('/production', (req, res) => {
    var id = -1;
    var data = {
        "prosumer_id": req.body.prosumer_id,
        "microgrid_id": req.body.microgrid_id,
        "produced_units": req.body.produced_units,
        "date": req.body.date,
        "time": req.body.time
    }
    
    let sql = 'INSERT INTO production SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        // console.log(result);
        id = result.insertId;

    });

    setTimeout(() => {
        var data2 = {
            "$class": "org.example.mynetwork.Commodity",
            "id": id,
            "units": req.body.produced_units,
            "price": 40,
            "owner": "org.example.mynetwork.Trader#" + req.body.prosumer_id
        }
         
        try {
            axios.post('http://192.168.131.131:3000/api/Commodity', data2)
            .then(function (response) {
                console.log("success");
                // res.status(200).json({
                //     message: response,
                // });
            })
        } catch (error) {
            console.log(error);
        }
        // axios.post('http://192.168.131.129:3000/api/Commodity', data2)
        // .then(function (response) {
        //     res.status(200).json({
        //         message: response,
        //     });
        // })
        // .catch(function (error) {
        //     res.status(400).json({
        //         message: error,
        //     });
        //     console.log("error");
        // });

    }, 3000);



    res.status(201).json({
        message: 'Data Added',
    });

});

module.exports = router;
