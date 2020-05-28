module.exports = function (server) {
    let socketio = require('socket.io');
    const mysqlID = 'root';
    const mysqlPW = '1q2w3e4r!@';
    const dbName = 'capstone';

    let conn = mysql.createConnection({
        user: mysqlID,
        password: mysqlPW,
        database: dbName
    });

    let io = socketio.listen(server);
    let userCnt = 0;
    let isSending = false;

    io.sockets.on('connection', function (socket) {
        userCnt++;
        if (userCnt == 1 && isSending == false) {
            isSending = true;
            while (isSending) {  
                let sql = 'select content from objhistory-crosswalk order by id desc limit 1';
                conn.query(sql, function (error, results) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (results.length == 0) 
                            continue;
                        else {
                            let data = {
                                arr: results[0].content
                            }
                            socket.emit("message", data);
                            if (userCnt < 1) {
                                isSneding = false;
                            }
                        }
                    }
                });
            }
        }
        
        socket.on('disconnect', function() {
            userCnt--;
        });
    });


}