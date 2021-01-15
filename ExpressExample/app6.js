var express = require('express');
var http = require('http');
 
// 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정
// process.env.PORT = PORT 환경변수를 포트로 사용하라. 그렇지 않으면 3000 포트 사용


app.use(function(req, res, next) { // req요청, res결과, next다음
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent'); // 요청 헤더의 User-Agent 추출, 웹인지 모바일인지 파악 가능
    var paramName = req.query.name; // 쿼리 
    
    res.send('<h3>서버에서 응답 : User-Agent => ' + userAgent + '</h3>             <h3> paramName =>' + paramName +'</h3>');
    
});// 미들웨어 등록 = 함수


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){ // express 서버 설정
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});