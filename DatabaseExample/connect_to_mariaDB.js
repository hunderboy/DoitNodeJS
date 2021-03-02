

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');


// 익스프레스 객체 생성
var app = express();


// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));


//===== 데이터베이스 연결 =====//

// mysql DB를 사용할수 있는 mysql 모듈 호출하기
var mysql = require('mysql');
//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    connectionLimit : 64, 
    host     : 'maria-1.c8ai8geszcmt.ap-northeast-2.rds.amazonaws.com',
    user     : 'everex_admin',
    password : 'EverEX2019~!AWS',
    database : 'test',
    debug    :  false
});



var confirmConnection = function() {
    console.log('confirmConnection 커넥션 확인 함수 호출');
    pool.getConnection(function(err, conn) {
        // 커넥션 에러시
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함 - 에러시 connection 객체를 반납한다는 의미
            }
            
            callback(err, null);
            return;
        }   
        // 커넥션 무사 통과
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        // 2. create
        // 3. update
        // 4. delete
        
        // 1. select [sql 생성]
        // 데이터를 객체로 만듦
        // var data = {id:id, name:name, age:age, password:password};
                
        // select * from test;
        var selectData = conn.query('select * from users', function(err, rows, fields) {

            conn.release();  // 반드시 해제해야 함
            console.log('실행된 SQL : ' + selectData.sql);
            if (err) {
                console.log('SQL 실행 시 에러 발생함.');
                console.dir(err);
                
                callback(err, null);
                
                return;
            }
            
            console.log(rows);
            console.log(fields);
            var result = 'rows : ' + JSON.stringify(rows) + '<br><br>' +
                'fields : ' + JSON.stringify(fields);
            res.send(result);


            // console.log('select 결과 : ' + result);
            // callback(null, result);
        });



        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
        });
    });
}





// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  confirmConnection();

});

