


var login = function(req, res){
    console.log('/process/login 라우팅 함수 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
   
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
	
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
};



var adduser = function(req, res) {
	console.log('/process/adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
	
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
	
};



var listuser = function(req, res) {
	console.log('/process/listuser 호출됨.');
    
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
	if (database) {
		// 1. 모든 사용자 검색
		database.UserModel.findAll(function(err, results) {
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
	
};






// 1. 로그인 하는 사용자를 인증하는 함수
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨');
    
    db.UserModel.findById(id, function(err, results){
        if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');
			
			// 2. 패스워드 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출
			var user = new UserModel({id:id});
			var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
			if (authenticated) {
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
	var user = new db.UserModel({"id":id, "password":password, "name":name});

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









module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;


