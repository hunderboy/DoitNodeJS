var express = require('express');
var http = require('http');
 
// 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정
// process.env.PORT = PORT 환경변수를 포트로 사용하라. 그렇지 않으면 3000 포트 사용

// app.use 미들웨어 등록 
app.use(function(req, res, next) { // req요청, res결과, next다음
    console.log('첫번째 미들웨어 호출됨.');
    // 헤더정보를 넣겠다.
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});// 200 정상응답
    res.end('<h1>서버에서 응답한 결과입니다. </h1>');
        
});


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){ // express 서버 설정
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});