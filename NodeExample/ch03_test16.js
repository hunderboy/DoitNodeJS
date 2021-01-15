/**
 * 3장 Test 16
 * 
 * 함수가 결과값으로 리턴됨
 */

function add(a, b, callback) {
	var result = a + b;
	callback(result);

    // 어떻게 연산이 되었는지 기록을 남기고 싶다...
	var history = function() {
		return a + ' + ' + b + ' = ' + result; 
	};
	return history; // add 함수의 return 값
}
// var history 함수다. 표현될때는 return 값으로 표현
var history = add(10, 10, function(result) {
	console.log('파라미터로 전달된 콜백 함수 호출됨.');
	console.log('더하기 (10, 10)의 결과 : %d', result);
});

console.log('history 의 자료형' + typeof(history)); // 자료형 function
console.log('결과값으로 받은 함수 실행 결과 : ' + history());// return 값



