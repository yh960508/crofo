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

        //console.log(lat);
        //console.log(lon);
        //console.log(angle);

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
    let angle = data.angle;
    let obj = {};
    let arr = [];

    //Crosswalk DB에서 현재 차량 위치랑 가까운 위치에 있는 교차로명 위도, 경도를 json형태로 저장
    //json 반복문 돌면서 arr에 삽임

    //json형태로 android에 목록 전송
});





module.exports = router;