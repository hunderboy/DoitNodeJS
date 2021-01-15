var express = require('express');
var http = require('http');
var static = require('serve-static');// static 미들웨어
var path = require('path');// 경로 모듈
var bodyParser = require('body-parser');// post 방식의 데이터 추출


// 웹서버를 위한 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정

// static 미들웨어 등록
//app.use(static(path.join(__dirname, 'public')));
// http://localhost:3000/images/house.png
app.use('/public', static(path.join(__dirname, 'public')));
// http://localhost:3000/public/images/house.png

// body-parser 미들웨어 등록
// get 방식의 경우 파라미터를 url 내에 존재 하는데 post 방식의 경우 body에 포함됨.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.use(function(req, res, next) { // req요청, res결과, next다음
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
//    var paramName = req.query.name; // get 방식
//    var paramName = req.body.name;  // post 방식
    var paramId = req.body.id || req.query.id;// post,get 모두 사용
    
    res.send('<h3>서버에서 응답 : User-Agent => ' + userAgent + '</h3>             <h3> paramId =>' + paramId +'</h3>');
    
});// 미들웨어 등록 = 함수


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){ // express 서버 설정
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});