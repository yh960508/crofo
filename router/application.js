let express = require('express');
let router = express.Router();
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

router.post('/cross/find', function (request, response) { //운전자가 길찾기 기능을 사용하지 않았을 때
    let data = request.body;
    let lat = data.lat;
    let lon = data.lon;
    let cnt = 0;
    let arr = [];

    let sql = 'select * from intersection';
    conn.query(sql, function(error, results) {
        if (error) {
            console.log(error);
        } else {
            let len = results.length;
            if (len == 0) {
                response.json({
                    result: false
                });
            } else {
                for (let i = 0; i < len; i++) {
                    let distance = getDistance(lat, lon, results[i].cent_x, results[i].cent_y);
                    if (distance < 3000) {
                        let obj = {
                            id: results[i].id,
                            key: results[i].key,
                            cent_x: results[i].cent_x,
                            cent_y: results[i].cent_y,
                            loc_x0: results[i].loc_x0,
                            loc_y0: results[i].loc_y0,
                            loc_x1: results[i].loc_x1,
                            loc_y1: results[i].loc_y1,
                            loc_x2: results[i].loc_x2,
                            loc_y2: results[i].loc_y2,
                            loc_x3: results[i].loc_x3,
                            loc_y3: results[i].loc_y3,
                            cen_x0: results[i].cen_x0,
                            cen_x1: results[i].cen_x1,
                            cen_x2: results[i].cen_x2,
                            cen_x3: results[i].cen_x3,
                            cen_y0: results[i].cen_y0,
                            cen_y1: results[i].cen_y1,
                            cen_y2: results[i].cen_y2,
                            cen_y3: results[i].cen_y3
                        };
                        cnt++;
                        arr.push(obj);
                    }
                    if (i + 1 == len) {
                        response.json({
                            arr: arr,
                            result: true
                        });
                    }
                }
            }
        }
    });
});

function getDistance(lat1, lon1, lat2, lon2){
    let distance = 0;
    let theta = 0;
    
    theta = lon1 - lon2;
    distance = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    distance = Math.acos(distance);
    distance = rad2deg(distance);

    distance = distance * 60 * 1.1515;
    distance = distance * 1.609344;    // 단위 mile 에서 km 변환.
    distance = distance * 1000.0;      // 단위  km 에서 m 로 변환

    return distance;
}

function deg2rad(degree) {
    let pi = Math.PI;
    return degree * pi / 180;
}

function rad2deg(radian) {
    let pi = Math.PI;
    return radian * 180 / pi;   
}

module.exports = router;