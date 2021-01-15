


var crypto = require('crypto');


var Schema = {};

/*
mongoose 도 일반적으로 생각할때는 require('mongoose'); 처럼 외장 모듈을 불러와야 할것 같지만
self_app.js 에서 DB 와 연결 지을때 설정되어 이미 사용되고 있다.
그래서 createSchema 를 부를때 입력인수로 설정이 온전히 끝난 mongoose 변수를 넘겨 받는다.
*/
Schema.createSchema = function(mongoose) { // Schema 객체에 createSchema 라는 함수 할당
    console.log('createSchema 호출됨' );
    // 스키마 정의
    var UserSchema = mongoose.Schema({ // 유저 스키마 변수 생성
        id: {type: String, required: true, unique: true, 'default':''},
        hashed_password: {type: String, required: true, 'default':''},
        salt: {type:String, required:true},
        name: {type: String, index: 'hashed', 'default':''},
        age: {type: Number, 'default': -1},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });
    console.log('UserSchema 정의함.');

        
	// password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 가상 속성임. 
    // 특정 속성을 지정하고 set, get 메소드를 정의함
	UserSchema
	  .virtual('password')
	  .set(function(password) {
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password의 set 호출됨 : ' + this.hashed_password);
	  })
	  
        
	// 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
	// 비밀번호 암호화 메소드
	UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// salt 값 만들기 메소드
	UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
        
	// 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
            // 암호화 비번이 실제저장된 것과 같은가??
			return this.encryptPassword(plainText, inSalt) === hashed_password; 
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});

	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};



    // 스키마에 static으로 findById 메소드 추가
    UserSchema.static('findById', function(id, callback) {
        return this.find({id:id}, callback); // this 는 이 함수를 호출한 객체 = UserModel 객체
    });

    // 스키마에 static으로 findAll 메소드 추가
    UserSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });
       
    
    return UserSchema; // 이함수를 호출하고 결과 리턴 값으로 UserSchema를 리턴함.
}


// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;


