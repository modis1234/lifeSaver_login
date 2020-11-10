const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const queryconfig = require('./query/account_query');
const pool = require('./config/connection');


//계정 조회
router.get('/accounts', (req, res, next) => {
    let _query = queryconfig.findByAll();
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});


//계정 등록
router.post('/accounts', (req, res, next) => {
    let reqBody = req.body;
    let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    reqBody['createdDate'] = date;
    let _password = reqBody['password'];
    let securityPW = crypto.createHash('sha512').update(_password).digest('base64');
    reqBody['password'] = securityPW;

    let _query = queryconfig.insert(reqBody);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    var insertId = results.insertId;
                    if (insertId) {
                        reqBody["id"] = insertId;
                        res.send(reqBody).end();
                    } else {
                        res.status(500).end();
                    }
                }
            });
            connection.release();

        }
    });
});


//계정 수정
router.put('/accounts/:id', (req, res, next) => {
    let reqBody = req.body;
    let _id = req.params.id;
    reqBody['id'] = _id;

    let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    reqBody['modifiedDate'] = date;

    let _query;
    let hasPassword = reqBody.hasOwnProperty('password');
    if(hasPassword){
        let _password = reqBody['password'];
        let securityPW = crypto.createHash('sha512').update(_password).digest('base64');
        reqBody['password'] = securityPW;
        _query = queryconfig.isPwUpdate(reqBody);

    } else {
        _query = queryconfig.update(reqBody);
    }

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    var changedRows = results['changedRows'];
                    if (changedRows) {
                        res.json(reqBody);
                    }
                }
            });
            connection.release();

        }
    });
});

//계정 삭제
router.delete('/accounts/:id', (req, res, next) => {
    let _id = req.params.id;
    let _query = queryconfig.delete(_id);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    res.json(results);
                }
            });
            connection.release();

        }
    });
});

//중복체크
router.post('/accounts/checked', (req, res, next) => {
    let reqBody = req.body;

    let _query = queryconfig.checked(reqBody);
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    let resObj = {};
                    let accountCnt = results[0]['count'];
                    if (accountCnt > 0) {
                        resObj['isDate'] = true  
                    } else {
                        resObj['isDate'] = false
                    }
                    res.json(resObj);
                }
            });
            connection.release();

        }
    });
});

router.post('/accounts/auth', (req, res, next)=>{
    let reqBody = req.body;
    let _password = reqBody['password'];
    let securityPW = crypto.createHash('sha512').update(_password).digest('base64');
    reqBody['password'] = securityPW;
    console.log(reqBody)
    let _query = queryconfig.auth(reqBody);
    console.log(_query)
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).end();
            throw err;
        } else {
            connection.query(_query, (err, results) => {
                if (err) {
                    res.status(404).end();
                    throw err;
                } else {
                    console.log(results)
                    let resObj = results[0];
                    var count = resObj['count'];
                    if(count>0){
                        resObj['auth'] = true;
                    } else {
                        resObj['auth'] = false;
                    } 
                    res.json(resObj);
                }
            });
            connection.release();

        }
    });


});


module.exports = router;
