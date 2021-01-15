
/**
 * 4장 Test 4
 * 
 * 프로토타입 객체를 만들고 EventEmitter를 상속하도록 하기
 */
// 계산기 객체는 따로 만들면서 모듈도 따로 분리


var Calc = require('./calc3'); // 상대 주소 설정

var calc = new Calc(); // 객체 생성
calc.emit('stop');

console.log(Calc.title + '에 stop 이벤트 전달함.');
