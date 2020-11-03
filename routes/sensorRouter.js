const express = require('express');
const router = express.Router();
const request = require('request');


const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const queryconfig = require('./query/sensor_query');
const serverQueryConfig = require('./query/server_query');
const pool = require('./config/connection');

let _getData = require('./config/getData');
let requestDate = {
    sensor: {
        inesrt(data) {
            // 정보 추가
            let postObj = {};
            postObj['id'] = data['id']
            postObj['device_index'] = data['device_index']
            postObj['sensor_index'] = data['sensor_index']
            postObj['server_index'] = data['server_index']
            postObj['site_index'] = data['site_index']
            postObj['name'] = data['name']
            postObj['version'] = data['version']
            
            let postURL = _getData.serverList[data['server_index']]+'/sensor/sensors/';
            request.post({
                url: postURL,
                body: postObj,
                json: true
            },
                function (error, _res, _body) {
                    if (!error) {

                        //res.redirect(servers.apisvr.url + '/api/network');
                    } else {
                        // res.status(404).end();
                        console.log(error)
                    }
                });
            
        },
        update(params, data) {
            //센서 정보 수정
            let putObj = {};
            putObj['id'] = data['id']
            putObj['device_index'] = data['device_index']
            putObj['sensor_index'] = data['sensor_index']
            putObj['site_index'] = data['site_index']
            putObj['name'] = data['name']
            putObj['version'] = data['version']

            let putURL = _getData.serverList[data['server_index']]+'/sensor/sensors/'+ params;
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
        delete(sensorIndex, serverIndex) {
            var deleteURL =  _getData.serverList[serverIndex]+'/sensor/sensors/'+sensorIndex;
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


//센서 조회
router.get('/sensors', (req, res, next) => {
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

router.get('/sensors/:siteIndex', (req, res, next) => {
    let _siteIndex = req.params['siteIndex'];
    let _query = queryconfig.findBySiteIndex(_siteIndex);
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


//센서 등록
router.post('/sensors', (req, res, next) => {
    let reqBody = req.body;
    let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    reqBody['createdDate'] = date;
    let _serverIndex = reqBody['server_index']
    let _query = queryconfig.insert(reqBody) + serverQueryConfig.plusNumber(_serverIndex);
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
                    var result = results[0];
                    var insertId =result.insertId;
                    if(insertId){
                        _getData.getSensorInfo();
                        reqBody["id"] = insertId;
                        res.send(reqBody).end();
                        requestDate.sensor['inesrt'](reqBody);
                    } else {
                        res.status(500).end();
                    }
                }
            });
            connection.release();

        }
    });
});


//센서 수정
router.put('/sensors/:id', (req, res, next) => {
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
                    _getData.getSensorInfo();
                    var changedRows = results['changedRows'];
                    if(changedRows){
                        requestDate.sensor['update'](_id, reqBody);
                      res.json(reqBody);
                    }
                }
            });
            connection.release();

        }
    });
});

//센서 삭제
router.delete('/sensors/:sensorIndex/:serverIndex', (req, res, next) => {
    let _serverIndex = req.params.serverIndex
    let _sensorIndex = req.params.sensorIndex
    // let _id = req.params.id;
    // let _query = queryconfig.delete(_sensorIndex);
    let _query = queryconfig.delete(_sensorIndex)+serverQueryConfig.minusNumber(_serverIndex);
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
                    let result = results[0];
                    let _affetctedRows = result['affectedRows']
                    if(_affetctedRows){
                        _getData.getSensorInfo();
                        res.json(result);
                        requestDate.sensor['delete'](_sensorIndex, _serverIndex);
                    }  else {
                        res.status(404).end();
                    }

                }
            });
            connection.release();

        }
    });
    // res.status(200).end();
});

router.post('/sensors/checked', (req, res, next) => {
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
