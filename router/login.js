let express = require('express');
let router = express.Router();
let fs = require('fs');
let mysql = require('mysql');
let session = require('express-session');
let MYSQLStore = require('express-mysql-session')(session);
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const mysqlPW = 'pw';
const dbName = 'name';
const sessionKey = 'secretkey';
/*
let client = mysql.createConnection({
    user: 'root',
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
        user: 'root',
        password: mysqlPW,
        database: dbName
    })
}));
*/
router.get('/', function(request, response) {
    fs.readFile('./Web_Page.html', 'utf8', function(error, data) {
        if(error) {
            console.log(error);
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        }
    });
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);


module.exports = router;