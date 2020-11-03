const express = require('express');
const router = express.Router();
const request = require('request');


const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const queryconfig = require('./query/site_query');
const pool = require('./config/connection');

let _getData = require('./config/getData');
let requestDate = {
    site: {
        inesrt(data) {
            //사업장 정보 추가
            let postObj = {};
            postObj['id'] = data['id']
            postObj['site_index'] = data['site_index']
            postObj['name'] = data['name']

            let postURL = _getData.serverList[data['server_index']]+'/site/sites/';
            request.post({
                url: postURL,
                body: postObj,
                json: true
            },
                function (error, _res, _body) {
                    if (!error) {

                    } else {
                        // res.status(404).end();
                        console.log(error)
                    }
                });
        },
        update(params, data) {
            //사업장 정보 수정
            let putObj = {};
            putObj['id'] = params
            putObj['site_index'] = data['site_index']
            putObj['name'] = data['name']
            let putURL = _getData.serverList[data['server_index']]+'/site/sites/'+ params;
            request.put({
                url: putURL,
                body: putObj,
                json: true
            }, function (error, _res, _body) {
                if (!error) {
                
                } else {
                    //res.status(404).end();
                }
            });
        },
        delete(params) {
            var deleteURL = _getData.serverList[data['server_index']]+'/site/sites/'+ params;
            request.delete({
                url: deleteURL,
                body: {},
                json: true
            }, function (error, _res, _body) {
                if (!error) {

                } else {
                    //res.status(404).end();
                }
            });
        }
    }
}


//사업장 조회
router.get('/sites', (req, res, next) => {
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


//사업장 등록
router.post('/sites', (req, res, next) => {
    let reqBody = req.body;
    let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    reqBody['createdDate'] = date;
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
                        //requestDate.site['inesrt'](reqBody);
                    } else {
                        res.status(500).end();
                    }
                }
            });
            connection.release();

        }
    });
});


//사업장 수정
router.put('/sites/:id', (req, res, next) => {
    let reqBody = req.body;
    let _id = req.params.id;
    reqBody['id'] = _id;

    let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    reqBody['modifiedDate'] = date;

    let _query = queryconfig.update(reqBody);
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
                       // requestDate.site['update'](_id, reqBody);

                    }
                }
            });
            connection.release();

        }
    });
});

//사업장 삭제
router.delete('/sites/:id', (req, res, next) => {
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
                  //  requestDate.site['delete'](_id);

                }
            });
            connection.release();

        }
    });
});

//중복체크
router.post('/sites/checked', (req, res, next) => {
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

module.exports = router;
