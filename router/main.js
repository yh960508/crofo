let express = require('express');
let router = express.Router();
let fs = require('fs');
let mysql = require('mysql');
let session = require('express-session');
let MYSQLStore = require('express-mysql-session')(session);
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const mysqlID = 'root';
const mysqlPW = '1q2w3e4r!@';
const dbName = 'capstone';
const sessionKey = 'secretkey';

let conn = mysql.createConnection({
    user: mysqlID,
    password: mysqlPW,
    database: dbName
});

router.use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    store: new MYSQLStore({
        host: 'localhost',
        port: 3306,
        user: mysqlID,
        password: mysqlPW,
        database: dbName
    })
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(request, response) {
    if(request.user) {
        fs.readFile('./webpage/main.html', 'utf8', function(error, data) {
            if(error) {
                console.log(error);
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            }
        });
    } else {
        response.redirect('/login');
    }
});

router.get('/getVideoAmount', function(request, response) {
    if (!request.user) {
        response.redirect('/login');
    } else {
        let sql = 'select count(*) as cnt from video';
        conn.query(sql, function(error, results) {
            if (error) {
                console.log(error);
            } else {
                let cnt = results[0].cnt;
                response.json({
                    amount: cnt
                });
            }
        });
    }
});

router.get('/getVideoList/:page', function(request, response) {
    if (!request.user) {
        response.redirect('/login');
    } else {
        let index = request.params.page;
        let sql = 'select name, date from video order by date desc limit ' + index + ', ' + 10;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
            } else {
                if (results.length == 0) {
                    response.json({
                        result: false
                    });
                } else {
                    let arr = [];
                    let len = results.length;
                    let re = {
                        result: true,
                        length: len
                    };
                    arr[0] = re;
                    for(let i = 0; i < len; i++) {
                        let obj = {};
                        obj["name"] = results[i].name;
                        obj["date"] = results[i].date;
                        arr[i + 1] = obj;
                    }
                    let js = JSON.stringify(arr);
                    response.writeHead(200, { 'Content-Type': 'application/json;charset=utf8' });
                    response.end(js);
                }
            }
        });
    }
});

router.post('/loadVideo', function(request, response) {
    if (!request.user) {
        response.redirect('/login');
    } else {
        let videoName = [];
        let body = request.body;
        let cnt = body.cnt;
        for (let i = 0; i < cnt; i++) {
            videoName.push(body.name[i]);
        }
        let arr = [];
        for (let i = 0; i < cnt; i++) {
            let sql = 'select name, path, date from video where name=?';
            conn.query(sql, [videoName[i]], function(error, results) {
                if (error) {
                    console.log(error);
                } else {
                    let obj = {};
                    obj["name"] = results[0].name;
                    obj["date"] = results[0].date;
                    obj["path"] = results[0].path;
                    arr[i] = obj;

                    if (i + 1 == cnt) {
                        let js = JSON.stringify(arr);
                        response.writeHead(200, { 'Content-Type': 'application/json;charset=utf8' });
                        response.end(js);
                    }
                }
            });
        }
    }
});

module.exports = router;