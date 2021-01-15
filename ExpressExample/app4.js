var express = require('express');
var http = require('http');
 
// 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정
// process.env.PORT = PORT 환경변수를 포트로 사용하라. 그렇지 않으면 3000 포트 사용

// 1번째 미들웨어
app.use(function(req, res, next) { // req요청, res결과, next다음
    console.log('첫번째 미들웨어 호출됨.');
    
    req.user = 'mike';// user 라는 사용자 정보를 속성으로 추가 
    
    next(); // 다음 미들웨어로 넘김
    
});// 미들웨어 등록 = 함수


// 2번째 미들웨어
app.use(function(req, res, next){ // 이때 req는 user라는 속성이 추가된 상태에서 넘어옴
    console.log('두번째 미들웨어 호출됨.');
    
    // send 메소드로 바로 보낼수도 있다.
//    res.send('<h1>서버에서 응답한 결과입니다. : ' + req.user +'</h1>');
    
    // 1. 자바스크립트 객체를 그대로 보내는것도 가능하다.
    var person = {name:'소녀시대', age:20};
    res.send(person); // 자바스크립트 객체를 전달한다. JSON형태 자동 변환 되어 전송
    
//    // 2. 다른 형태의 객체 생성
//    var personStr = JSON.stringify(person);// Json형태로 직접 변환
//    res.send(personStr);
//    
//    // 3. 객체 전송
//    var personStr = JSON.stringify(person);// Json형태로 직접 변환
//    res.writeHead(200, {"Content-Type":"application/json;charset=utf8"});
//    res.write(personStr);
//    res.end('<h1>Json 출력 결과 확인 </h1>');
    
    
});



// Express 서버 시작
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});