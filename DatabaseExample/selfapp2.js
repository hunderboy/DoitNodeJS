
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

// mongo db 모듈사용
var MongoClient = require('mongodb').MongoClient;

// Session 미들웨어 불러오기
var expressSession = require('express-session');





var database;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    MongoClient.connect(databaseUrl, function(err, db){
       if(err){
           console.log('데이터베이스 연결시 에러발생함.');
           return;
       } 
       console.log('DB 연결됨 : ' + databaseUrl);
       database = db;        
    });
}


var app = express(); // 익스프레스 객체 생성



// 기본 속성 설정10tr
app.set('port', process.env.PORT || 3000);

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






var router = express.Router();
// 이 사이에  라우팅 할 코드 작성 ------ 시작


// 1. 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
   
    if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
            
            if(err){
                console.log('에러발생');
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>에러 발생</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
                return;
            }
            if(docs){
                console.dir(docs);

                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 로그인 성공</h1>');
				res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
            } else{
                console.log('사용자 데이터 조회 안됨.');
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 데이터 조회 안됨</h1>');
				res.end();
            }
        });
    } else{
        console.log('DB 연결 안됨.');
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
		res.write('<h1>DB 연결 안됨</h1>');
		res.end();
    } 
    
});




// 2. 사용자 추가 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post(function(req, res) {
	console.log('/process/adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (database) {
		addUser(database, paramId, paramPassword, paramName, function(err, result) {
            
            if(err){
                console.log('에러발생');
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>에러 발생</h1>');
				res.end();
                return;
            }
            if(result){
                console.dir(result);

                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 추가 성공</h1>');
				res.write('<div><p>사용자 : ' + paramName + '</p></div>');
				res.end();
            } else{
                console.log('사용자 추가 안됨');
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 추가 안됨</h1>');
				res.end();
            }
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
});



// 이 사이에  라우팅 할 코드 작성 ------ 끝
app.use('/', router);




// 로그인 하는 사용자를 인증하는 함수
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨');
    
    // users 컬렉션 참조 = 테이블 참조
	var users = db.collection('users');

    // 입력된 아이디와 패스워드에 따라 사용차를 찾는다.
    users.find({"id":id, "password":password}).toArray(function(err,docs){
        if(err){
            callback(err, null);
            return; // 빠져나오기
        }
        if(docs.length > 0 ){ // 1개 이상의 데이터 찾음
            console.log('일치하는 사용자 찾음');
            callback(null, docs);
        }else{ // 데이터 0개 찾음
            console.log("일치하는 사용자를 찾지 못함.");
	    	callback(null, null);
        }
        
        
    });
    
};


//사용자를 추가하는 함수 = 회원가입
var addUser = function(db, id, password, name, callback) {
	console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
	
	// users 컬렉션 참조
	var users = db.collection('users');

	// id, password, username을 이용해 사용자 추가
	users.insertMany([{"id":id, "password":password, "name":name}], function(err, result) {
		if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
			callback(err, null);
			return;
		}
		
        // 에러 아닌 경우, 콜백 함수를 호출하면서 결과 객체 전달
        if (result.insertedCount > 0) { // 정상적으로 데이터 추가됨
	        console.log("사용자 레코드 추가됨 : " + result.insertedCount);
	       callback(null, result);
        } else {
            console.log("추가된 레코드가 없음.");
	       callback(null, null);
        }
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

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
   
});
