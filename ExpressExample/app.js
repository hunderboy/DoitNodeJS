/**
 * 익스프레스를 사용한 가장 단순한 샘플
 * 
 * @date 2016-10-25
 * @author Mike
 */

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http');
 
// 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정
// process.env.PORT = PORT 환경변수를 포트로 사용하라. 그렇지 않으면 3000 포트 사용


// Express 서버 시작
// (port,콜백함수) = (app.get('port'), function(){})
http.createServer(app).listen(app.get('port'), function(){ 
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});
