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

module.exports = router;