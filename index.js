let express = require('express');
let app = express();
let http = require('http');
let bodyParser = require('body-parser');
let path = require('path');
let WebSocket = require('ws');
let server = http.createServer(app);
let wss = new WebSocket.Server({ server });

const PORT = 8080;

let loginRouter = require('./router/login');
let mainRouter = require('./router/main');
let appRouter = require('./router/application');

let {connection} = require('./websocket/connection');

app.connections = new connection(wss);


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