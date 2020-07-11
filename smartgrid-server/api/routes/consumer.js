const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config');

//get all consumers by microgrid
router.get('/get', (req, res) => {
    let sql = 'SELECT * FROM prosumer';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.status(200).json(
            results
        );
    });
});