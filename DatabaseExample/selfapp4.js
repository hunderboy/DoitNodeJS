
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

// mongoose 모듈사용
//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var database; // DB 객체 생성
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function() {
        console.log('데이터베이스 연결됨 : ' + databaseUrl);
        
        // 스키마 정의
		UserSchema = mongoose.Schema({
		    id: {type: String, required: true, unique: true},
		    password: {type: String, required: true},
		    name: {type: String, index: 'hashed'},
		    age: {type: Number, 'default': -1},
		    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
		    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
		});
		
		// 스키마에 static으로 findById 메소드 추가
		UserSchema.static('findById', function(id, callback) {
			return this.find({id:id}, callback); // this 는 이 함수를 호출한 객체 = UserModel 객체
		});
        
//        UserSchema.statics.findById = function(id, callback) {
//			return this.find({id:id}, callback); // this 는 이 함수를 호출한 객체 = UserModel 객체
//		};
        
        // 스키마에 static으로 findAll 메소드 추가
		UserSchema.static('findAll', function(callback) {
			return this.find({}, callback);
		});
        
        console.log('UserSchema 정의함.');
        
        
        
        
        UserModel = mongoose.model('users2', UserSchema);
        console.log('UserModel 정의함.');
    });
    
    
    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
    
    database.on('error', console.error.bind(console, '몽구스 연결 에러남'));
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




//3. 사용자 리스트 함수 = 사용자 리스트 보기
router.route('/process/listuser').post(function(req, res) {
	console.log('/process/listuser 호출됨.');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
	if (database) {
		// 1. 모든 사용자 검색
		UserModel.findAll(function(err, results) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 리스트 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			  
			if (results) {  // 결과 객체 있으면 리스트 전송
				console.dir(results);
 
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 리스트</h2>');
				res.write('<div><ul>');
				
				for (var i = 0; i < results.length; i++) {
					var curId = results[i]._doc.id;
					var curName = results[i]._doc.name;
					res.write('    <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
				}	
			
				res.write('</ul></div>');
				res.end();
			} else {  // 결과 객체가 없으면 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>조회된 사용자 없음</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
});


// 이 사이에  라우팅 할 코드 작성 ------ 끝
app.use('/', router);




// 1. 로그인 하는 사용자를 인증하는 함수
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨');
    
    UserModel.findById(id, function(err, results){
        if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');
			
			// 2. 패스워드 확인
			if (results[0]._doc.password === password) {
				console.log('비밀번호 일치함');
				callback(null, results);
			} else {
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}
			
		} else {
	    	console.log("아이디와 일치하는 사용자를 찾지 못함.");
	    	callback(null, null);
	    }
    });
    
};


// 2. 사용자를 추가하는 함수 = 회원가입
var addUser = function(db, id, password, name, callback) {
	console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);
	
	// UserModel 인스턴스 생성
	var user = new UserModel({"id":id, "password":password, "name":name});

	// save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
	user.save(function(err) {
		if (err) {
			callback(err, null);
			return;
		}
		
	    console.log("사용자 데이터 추가함.");
	    callback(null, user);
	     
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