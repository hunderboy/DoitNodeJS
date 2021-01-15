var express = require('express');
var http = require('http');
var static = require('serve-static');// static 미들웨어
var path = require('path'); // 경로 모듈
var bodyParser = require('body-parser');// post 방식의 데이터 추출


// 웹서버를 위한 익스프레스 객체 생성 
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정

//app.use(static(path.join(__dirname, 'public')));
// http://localhost:3000/images/house.png
app.use('/public', static(path.join(__dirname, 'public')));
// http://localhost:3000/public/images/house.png

// get 방식의 경우 파라미터를 url 내에 존재 하는데 post 방식의 경우 body에 포함됨.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());






// 라우터 객체 생성
var router = express.Router();

// 요청 path 지정 = '/process/login' = login2.html 의 <form method="post" action="/process/login"> 과 연관 됨
router.route('/process/login').post(function(req,res){// post 요청 시 처리
    console.log('/process/login 라우팅 함수에서 받음');
    
    var paramId = req.body.id || req.query.id;// post,get 모두 사용
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramId + "</p></div>");
    res.write("<div><p>" + paramPassword + "</p></div>");
    res.end();
    
});

// 라우터 등록 - 미들웨어
app.use('/',router);





// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){ // express 서버 설정
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});