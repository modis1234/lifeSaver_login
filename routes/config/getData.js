const queryconfig = require('../query/sensor_query');

const pool = require('./connection');
const request = require('request');
const mysql = require("mysql");

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var sensorState = {
    serverList: {},
    sensorList: {},
    getSensorInfo() {
        let _this = this;
        let _query = queryconfig.findByAll();
        pool.getConnection((err, connection) => {
            if (err) {
                throw err;
            } else {
                connection.query(_query, (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        _this.sensorList={}
                        for( i in results){
                            let siteIndex = results[i]['site_index'];
                            let _hasSiteProp = _this.sensorList.hasOwnProperty(siteIndex);
                            if(!_hasSiteProp){
                                _this.sensorList[siteIndex]=[];
                               
                            }

                            let serverIndex = results[i]['server_index']
                            let _hasServerProp = _this.serverList.hasOwnProperty(serverIndex);
                            if(!_hasServerProp){
                                _this.serverList[serverIndex] = results[i]['address'];
                            } else {
                                _this.serverList[serverIndex] = undefined;
                                _this.serverList[serverIndex] = results[i]['address'];

                            }

                            let _result = results[i];
                            _this.sensorList[siteIndex].push(_result);
                        }
                    }
                })
                connection.release();
            }
        });
    }
}


module.exports = sensorState;