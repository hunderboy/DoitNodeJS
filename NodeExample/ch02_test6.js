var clac2 = require('./calc2'); // calc2 모듈에서 만들어진 cals 객체를 그대로 리턴받는다.

console.log('모듈로 분리 한후 - calc2.add : '+ clac2.add(30,30));

// os 확인 모듈 - 외장 모듈
var nconf = require('nconf'); // 제공 되는 모듈인 경우에는 경로 설정 필요없이 이름만 붙여주면 된다
nconf.env();
var value = nconf.get('OS');
console.log('OS 환경변수의 값 : '+ value);
