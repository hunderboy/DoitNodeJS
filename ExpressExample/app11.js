var express = require('express');
var http = require('http');
var static = require('serve-static');// static 미들웨어
var path = require('path'); // 경로 모듈
var bodyParser = require('body-parser');// post 방식의 데이터 추출
var cookieParser = require('cookie-parser');// 쿠키 사용

// 웹서버를 위한 익스프레스 객체 생성 
var app = express();


// ---- 미들웨어들 등록하기 
// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000); // set 함수 'port'라는 속성 설정
app.use('/public', static(path.join(__dirname, 'public')));
// get 방식의 경우 파라미터를 url 내에 존재 하는데 post 방식의 경우 body에 포함됨.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());


var router = express.Router();

// 쿠키 설정
router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 라우팅 함수 호출됨');    
    
    res.cookie('user', {// 쿠키 설정
        id:'nike',
        name:'소녀시대',
        authorized:true // 인증 됏냐?? 인증됫다고 마크 붙여주는 거임
    });
    
    res.redirect('/process/showCookie');// 다음 주소로 리다이렉트 시킴
    
});
// 설정된 쿠키정보 보기
router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 라우팅 함수 호출됨'); 
    
    res.send(req.cookies);
});


router.route('/process/login')// 요청 path 지정 = '/process/login' = login2.html 의 	<form method="post" action="/process/login"> 과 연관 됨
      .post(function(req,res){
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