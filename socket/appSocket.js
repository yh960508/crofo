module.exports = function (server) {
    let socketio = require('socket.io');
    let mysql = require('mysql');

    const HOST = 'bic4907.diskstation.me'
    const MYSQLID = 'capstone';
    const MYSQLPW = 'capstone2020';
    const DBName = 'capstone';

    let conn = mysql.createConnection({
        host: HOST,
        user: MYSQLID,
        password: MYSQLPW,
        database: DBName
    });    

    let io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {
        let crosswalk;
        let intersection;

        socket.on('where', function(data) {
            let dir_x = data.x0;
            let dir_y = data.y0;
            let cro_x = data.x1;
            let cro_y = data.y1;
            let direction;
            intersection = data.in;

            let sql = 'select id from crosswalk where cen_x=? and cen_y=? and intersection_id=?';
            conn.query(sql, [dir_x, dir_y, intersection], function(error, results) {
                if (error) {
                    console.log(error);
                } else {
                    direction = results[0].id;
                    console.log('direction is ' + direction);
                    conn.query(sql, [cro_x, cro_y, intersection], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            crosswalk = result[0].id;
                            console.log('crosswalk is ' + crosswalk);
                            if (direction == 0) {
                                crosswalk = (crosswalk + 2) % 4;
                            } else if (direction == 1) {
                                crosswalk = (crosswalk + 3) % 4;
                            } else if (direction == 3) {
                                crosswalk = (crosswalk + 1) % 4;
                            } 
                
                            console.log(intersection + ", " + crosswalk);
                            socket.join(socket.id);
                        }
                    });
                }
            });
        });

        socket.on('request', function() {
            let sql = 'select content from objhistory where crosswalk_id=? and intersection_id=?';
            conn.query(sql, [crosswalk, intersection], function (error, results) {
                if (error) {
                    console.log(error);
                } else {
                    if (results.length == 0) {
                        console.log(intersection + ", " + crosswalk + ": has no data");
                    } else {
                        let json = JSON.parse(results[0].content);
                        let data = {
                            arr: json
                        };
                        console.log("socket.id: " + socket.id + "[ request: " + intersection + ", " + crosswalk + " ]");
                        console.log(data);
                        io.to(socket.id).emit("object", data);
                    }
                }
            });
        });
        
        socket.on('disconnect', function() {
            console.log(socket.id + " is disconnect");
        });
        
    });


}