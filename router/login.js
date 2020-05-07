let express = require('express');
let router = express.Router();
let fs = require('fs');
let mysql = require('mysql');
let session = require('express-session');
let MYSQLStore = require('express-mysql-session')(session);
let bkfd2Password = require('pbkdf2-password');
let hasher = bkfd2Password();
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const mysqlPW = '1q2w3e4r!@';
const dbName = 'capstone';
const sessionKey = 'secretkey';

let conn = mysql.createConnection({
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

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(request, response) {
    fs.readFile('./login.html', 'utf8', function(error, data) {
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

passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw'
    },
    function (username, password, done) {
        let sql = 'select * from login where id=?';
        conn.query(sql, [username], function(error, results) {
            if (error) {
                console.log(error);
            } else {
                if(results.length == 0) 
                    return done('there is no user');
                let user = results[0];
                return hasher({password:password, salt:user.salt}, function(err, pass, salt, hash) {
                    if (hash == user.password) {
                        console.log(user + ': login success');
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log(user + ': serializeUser');
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log(user + ': deserializeUser');
    let sql = 'select * from login where id=?';
    conn.query(sql, [id], function(error, results) {
        console.log(sql, error, results);
        if (error) {
            console.log(error);
        } else {
            done(null, results[0]);
        }
    });
});

module.exports = router;