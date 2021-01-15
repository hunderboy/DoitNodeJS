/**
 * 4장 Calc3
 * 
 * 모듈
 * 더하기 함수가 들어있는 calc3 모듈
 */

var EventEmitter = require('events').EventEmitter; // 상속을 위해서.. Calc 의 on 메소드는 이벤트 로써 사용가능하게끔 상속받아야 사용 가능
var util = require('util'); // 상속하기 쉽게 만들어줌

// 클래스 생성
var Calc = function() {
	var self = this;
	
	this.on('stop', function() { // 이벤트 리스너 on 등록
		console.log('Calc에 stop event 전달됨.');
	});
};

util.inherits(Calc, EventEmitter); // 상속(클래스,부모)

// 클래스 add 메소드
Calc.prototype.add = function(a, b) {
	return a + b;
}

module.exports = Calc; // 객체 직접 할당
module.exports.title = 'calculator';
