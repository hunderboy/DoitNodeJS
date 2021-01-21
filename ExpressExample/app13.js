/**
 * 파일 업로드하기
 * 
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청
 *    http://localhost:3000/public/photo.html
 *
 * 파일업로드를 위해 클라이언트에서 지정한 이름은 photo 입니다.
 *
 * @date 2016-10-25
 * @author Mike
 */

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

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');


// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더와 uploads 폴더 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());


//multer 미들웨어 사용 : 미들웨어 사용 순서 중요  body-parser -> multer -> router
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) { // destination 속성에 함수할당
        callback(null, 'uploads') // uploads 가 목적지 폴더임
    },
	filename: function (req, file, callback) { // filename 속성에 함수할당
		// 시간정보를 이름에 추가하여 항상 고유하게 설정
		// callback(null, file.originalname + Date.now()) 
		
		// 만약에 이미지파일일 경우 png 라는 확장자를 살리고 싶으면
		var extension = path.extname(file.originalname); // 확장자만 추출
		var basename = path.basename(file.originalname, extension); // 파일 이름만 추출
		// 이렇게 하면 파일이름은 EX) exampleFile.png 이러한 형태로 된다.
		callback(null, basename + Date.now() + extension)
    }
});

var upload = multer({ // multer 안에 {} 객체 할당, javascript 객체는 기본은 json 형태
    storage: storage,
    limits: {
		files: 10, // 한번에 업로드 할수 있는 개수 제한 = 10 개
		fileSize: 1024 * 1024 * 1024 // 한번에 업로드 할수 있는 최대 파일 Size 제한 = 1 GB 
	}
});


// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

// 파일 업로드 라우팅 함수 - 로그인 후 세션 저장함
/**
 업로드 하는 파일을 배열 형태로 받고 싶다면, post 함수를 시작할때,
 upload.array('photo', 1) 의미
 photo 라는 이름의 파라미터로 넘어온게 있으면, 그 1개를 배열에다가 추가해 주세요??
 */
router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
	console.log('/process/photo 라우팅 함수 호출됨.');
	
	try {
		var files = req.files; // req.files 에 파일이 있음
	
		console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
		if (files.length > 0 ){ // 일단 파일이 있는지 없는지 array로 넘어온 files을 length 로 확인
			console.dir(req.files[0]); // 배열이니까 1번째 요소인 [0]인덱스를 확인
		} else{ 
			console.log("파일이 없습니다.")
		}
        console.dir('#=====#')
		
		
		

		// 현재의 파일 정보를 저장할 변수 선언
		var originalname = '',
			filename = '',
			mimetype = '',
			size = 0;
		
		// Array.isArray = 배열인지 확인
		if (Array.isArray(files)) {// 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
	        console.log("배열에 들어있는 파일 갯수 : %d", files.length);
	        
	        for (var index = 0; index < files.length; index++) {
				// file 에서 값들 추출 해서, 변수에 할당
	        	originalname = files[index].originalname;
	        	filename = files[index].filename;
	        	mimetype = files[index].mimetype;
	        	size = files[index].size;
	        }
	        
	    } else {   // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
	        console.log("파일 갯수 : 1 ");
	        
	    	originalname = files[index].originalname;
	    	filename = files[index].name;
	    	mimetype = files[index].mimetype;
	    	size = files[index].size;
	    }
		
		console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', '
				+ mimetype + ', ' + size);
		
		// 클라이언트에 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h3>파일 업로드 성공</h3>');
		res.write('<hr/>');
		res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
		res.write('<p>MIME TYPE : ' + mimetype + '</p>');
		res.write('<p>파일 크기 : ' + size + '</p>');
		res.end();
		
	} catch(err) {
		console.dir(err.stack);
	}	
		
});
 
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
  console.log('Express server listening on port ' + app.get('port'));
});


