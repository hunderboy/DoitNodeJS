

// database 객체에 db, schema, model 모두 추가
var database = {};

// 초기화를 위해 호출하는 함수
database.init = function(app, config) {
	console.log('init() 호출됨.');
	
	connect(app, config);
}



//데이터베이스에 연결하고 응답 객체의 속성으로 db 객체 추가
function connect(app, config) {
	console.log('connect() 호출됨.');
	
	// 데이터베이스 연결 : config의 설정 사용
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
	mongoose.connect(config.db_url);
	database.db = mongoose.connection;
	
	database.db.on('error', console.error.bind(console, 'mongoose connection error.'));	
	database.db.on('open', function () {
		console.log('데이터베이스에 연결되었습니다. : ' + config.db_url);
		
		// config에 등록된 스키마 및 모델 객체 생성
		createSchema(app, config);
		
	});
	database.db.on('disconnected', connect);

}
