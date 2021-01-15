
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

// Session 미들웨어 불러오기
var expressSession = require('express-session');


var user = require('./self_routes/self_user');

var config = require('./self_config');


// 암호화 모듈
var crypto = require('crypto');


// mongoose 모듈사용
//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var database;
var UserSchema;
var UserModel;






var app = express(); // 익스프레스 객체 생성


console.log('config.server_port : %d', config.server_port);
// 기본 속성 설정10tr
app.set('port', config.server_port || 3000);

app.use(bodyParser.urlencoded({extended: false}))//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.json()) // body-parser를 이용해 application/json 파싱

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



function connectDB() {
    
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database = mongoose.connection;
    
    database.on('open', function() {
        console.log('데이터베이스 연결됨 : ' + databaseUrl);
        
		// user 스키마 및 모델 객체 생성
		createUserSchema(database);
    });
    
    
    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
    
    database.on('error', console.error.bind(console, '몽구스 연결 에러남'));
    
    
    app.set('database', database);
    
}


// user 스키마 및 모델 객체 생성
function createUserSchema(database) {
	// 2. user_schema.js 모듈 불러오기
	database.UserSchema = require('./self_database/self_user_schema').createSchema(mongoose);
	
	// User 모델 정의
	database.UserModel = mongoose.model("users3", database.UserSchema);
	console.log('UserModel 정의함.');
}




var router = express.Router();
// 이 사이에  라우팅 할 코드 작성 ------ 시작


// 1. 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
// 4. 로그인 처리 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/login').post(user.login);

// 2. 사용자 추가 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
// 5. 사용자 추가 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/adduser').post(user.adduser);

// 3. 사용자 리스트 함수 = 사용자 리스트 보기
// 6. 사용자 리스트 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/listuser').post(user.listuser);


// 이 사이에  라우팅 할 코드 작성 ------ 끝
app.use('/', router);









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

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
   
});