let express = require('express');
let router = express.Router();
let mysql = require('mysql');

const mysqlID = 'root';
const mysqlPW = 'root';
const dbName = 'capstone';

let conn = mysql.createConnection({
    user: mysqlID,
    password: mysqlPW,
    database: dbName
});

/*
router.get('/', function (request, response) {
    console.log("get request");
    response.json({
        data: "hello"
    });
});
*/

router.post('/cross/list', function (request, response) { //운전자가 길찾기 기능을 사용했을 때
    let data = request.body;
    let arr = data.crossList;
    let len = arr.length;

    for (let i = 0; i < len; i++) {
        let lat = parseFloat(arr[i].lat);
        let lon = parseFloat(arr[i].lon);
        let angle = parseFloat(arr[i].angle);

        console.log(lat);
        console.log(lon);
        console.log(angle);

        //Crosswalk DB에서 교차로 목록과 비교해서 해당 교차로가 DB에 등록되어있는지 확인
        //그 후 personalCross DB에 해당 교차로 목록 개인별로 저장

        //DB 목록에 없는 교차로면 arr에서 해당 교차로 삭제
    }

    response.json({
      crossList: arr
    });
});

router.post('/cross/find', function (request, response) { //운전자가 길찾기 기능을 사용하지 않았을 때
    let data = request.body;
    let lat = data.lat;
    let lon = data.lon;
    let cnt = 0;
    let arr = [];
    
    console.log(lat, lon);

    //Crosswalk DB에서 현재 차량 위치랑 가까운 위치에 있는 교차로명 위도, 경도를 json형태로 저장
    //json 반복문 돌면서 arr에 삽임
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
                            cent_x: results[i].cent_x,
                            cent_y: results[i].cent_y,
                            loc_x0: results[i].loc_x0,
                            loc_y0: results[i].loc_y0,
                            loc_x1: results[i].loc_x1,
                            loc_y1: results[i].loc_y1,
                            loc_x2: results[i].loc_x2,
                            loc_y2: results[i].loc_y2,
                            loc_x3: results[i].loc_x3,
                            loc_y3: results[i].loc_y3
                        };
                        cnt++;
                        arr.push(obj);
                    }
                    if (i + 1 == len) {
                        response.json({
                            arr: arr,
                            cnt: cnt,
                            result: true
                        });
                    }
                }
            }
        }
    });
    
    //json형태로 android에 목록 전송
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