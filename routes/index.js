var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
const crypto = require('crypto');
const queryconfig = require('./query/account_query');
const pool = require('./config/connection');

var _getData = require('./config/getData');


_getData.getSensorInfo();
setInterval(() => {
  _getData.getSensorInfo();

}, 5000);

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('AGENT--->', req.headers['user-agent'])
  /*
    1.chrome
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36
    2. IE
    Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
    3.Android
    Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36
    4.갭럭시 탭
    Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-T290 Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.2 Chrome/67.0.3396.87 Safari/537.36
    5.iphone
    Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1
    6.iphone-네이버
    Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/605.1 NAVER(inapp; search; 598; 10.27.3; 6S)
    6.iphone-사파리
    Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1

  */

 let _ip = req.ip;
 
 let _loginObj = req.session.login;
 if (!_loginObj) {
   req.session.login = {}
   res.clearCookie('sensorName', { path: '/' });
   res.clearCookie('siteName', { path: '/' });
   res.clearCookie('siteIndex', { path: '/' });
   res.clearCookie("sensorIndex", { path: '/' });
   res.clearCookie("version", { path: '/' });
   res.clearCookie("sensorList", { path: '/' });
   res.clearCookie("login", { path: '/' });
  }
  var agent = req.headers['user-agent'].toLowerCase();
  let hasIsLogined = req.session.login.hasOwnProperty(_ip);

  if (hasIsLogined) {
    let _account = req.session.login[_ip];
    let _role = _account['role'];
    if (agent.indexOf("win64") > -1 || agent.indexOf("wow64") > -1) {
      if (_role === 0) {
        var msgObj = {};
        msgObj['success'] = true;
        msgObj['msg'] = 'OPENWORKS 계정으로 로그인 되었습니다.'
        msgObj['id'] = _account['user_id']
        res.render('main');
        // res.json('main');

      }
      else if (_role === 1) {
        let _sensorIndex = req.cookies['sensorIndex'];

        if (_sensorIndex) {
          res.render('main');
        } else {
          res.redirect('/logout');
        }

      }

    }
    else if (agent.indexOf("android") > -1) {
      console.log('Mobile!!!!');
      //res.render('main_m', { title: 'Express_Mobile' });
      res.render('main_mobile');
    } // end agent type 
  } else {
    console.log('로그아웃!!!');
    if (agent.indexOf("win64") > -1 || agent.indexOf("wow64") > -1 || agent.indexOf("windows") > -1) {
      console.log(agent)
      res.render('main');
    }
    else if (agent.indexOf("android") > -1 || agent.indexOf("iphone") > -1) {
      console.log('Mobile');
      res.render('main_mobile');

    }
  }
});


var loginObj = {};

//로그인
router.post('/login', (req, res, next) => {
  var _ip = req.ip;

  var _body = req.body;
  var _password = _body.password;
  var securityPW = crypto.createHash('sha512').update(_password).digest('base64');
  var _query = queryconfig.login(_body);
console.log(_query)
  //풀에서 컨넥션 획득
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      throw err;
    } else {
      //커넥션 사용
      connection.query(_query, (err, results) => {
        if (err) {
          throw err;
        } else {
          var msgObj = {};
          if (results.length === 0) {
            msgObj['success'] = false;
            msgObj['msg'] = '해당 유저가 존재하지 않습니다.'
            msgObj['error'] = 'user-fail'

            //res.render('main', msgObj);
            res.json(msgObj).end();
            console.log('results-->',results)

          } else {
            if (securityPW !== results[0].password) {
              msgObj['success'] = false;
              msgObj['msg'] = '비밀번호가 일치하지 않습니다.'
              msgObj['id'] = _body['userId']
              msgObj['error'] = 'password-fail'

              //res.render('login', msgObj);
              res.json(msgObj).end();

            } else {
              var _isIPprop = loginObj.hasOwnProperty(_ip);
              if(!_isIPprop){
                loginObj[_ip] = {};
              }
              console.log(loginObj);

              var user = results[0];
              var obj = {};
              obj['user_id'] = user['user_id'];
              obj['name'] = user['name'];
              obj['role'] = user['role'];
              obj['site_index'] = user['site_index']
              obj['site_name'] = user['site_name']
              obj['isLogined'] = true;
              loginObj[_ip] = obj;
              req.session.login = loginObj;
              req.session.save(() => {
                res.cookie('siteIndex', user['site_index']);
                res.cookie('login', req.session.login[_ip]);

                let _role = user['role'];
                if (_role === 0) {
                  msgObj['success'] = true;
                  msgObj['msg'] = 'OPENWORKS 계정으로 로그인 되었습니다.'
                  msgObj['id'] = _body['userId']
                  res.json(msgObj).end();
                }
                else if (_role === 1) {
                  let siteIndex = user['site_index'];
                  var agent = req.headers['user-agent'].toLowerCase();
                  if (agent.indexOf("android") > -1 || agent.indexOf("iphone") > -1) {
                    res.cookie('sensorList', _getData.sensorList[siteIndex])
                  }
                    console.log(_getData.sensorList[siteIndex])
                    res.json(_getData.sensorList[siteIndex]).end();

                }

              }); //session store에 바로 적용하는 함수
            }
          }
        }
      });
      //커넥션 반환( 커넥션 종료 메소드가 커넥션과 다르다 )
      connection.release();
    }
  });
});

router.get('/logout', function (req, res, next) {
  let _ip = req.ip;
  let account = req.cookies['login'];
  if (account) {
    res.clearCookie('login');
    res.clearCookie('io');
    res.clearCookie('sensorIndex');
    res.clearCookie('siteIndex');
    res.clearCookie('site');
    res.clearCookie('sensorName');
    res.clearCookie('siteName');

  }

  if (req.session.login) {
    delete req.session.login[_ip]
  }
  res.redirect('/');

});

router.get('/logincomp', function (req, res, next) {
  res.render('login');
});
// administrator
router.get('/administrator', (req, res, next) => {
  res.render('administrator');
});
router.get('/adminHeader', (req, res, next) => {
  res.render('admin/adminHeader');
});
router.get('/account', (req, res, next) => {
  res.render('admin/account');
});
router.get('/accountForm', (req, res, next) => {
  res.render('admin/accountForm');
});
router.get('/site', (req, res, next) => {
  res.render('admin/siteInfo');
});
router.get('/siteForm', (req, res, next) => {
  res.render('admin/siteInfoForm');
});
router.get('/server', (req, res, next) => {
  res.render('admin/serverInfo');
});
router.get('/serverForm', (req, res, next) => {
  res.render('admin/serverInfoForm');
});
router.get('/sensor', (req, res, next) => {
  res.render('admin/sensorInfo');
});
router.get('/sensorForm', (req, res, next) => {
  res.render('admin/sensorInfoForm');
});

/** 모바일 */
router.get('/login_m', (req, res, next) => {
  res.render('mobile/login');
});



module.exports = router;
