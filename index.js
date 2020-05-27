let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser');
let path = require('path');
let server = http.createServer(app);

const PORT = 4446;

let loginRouter = require('./router/login');
let mainRouter = require('./router/main');
let appRouter = require('./router/application');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

server.listen(PORT, function() {
    console.log('Server running');
});

app.use(express.static(path.join('public', '/')));

app.use('/login', loginRouter);
app.use('/', mainRouter);
app.use('/app', appRouter);