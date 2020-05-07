let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser');
let path = require('path');

let loginRouter = require('./router/login');
let mainRouter = require('./router/main');

let server = http.createServer(app);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

server.listen(8080, function() {
    console.log('Server running');
});

app.use(express.static(path.join('public', '/')));

app.use('/login', loginRouter);
app.use('/', mainRouter);
