/**
 * 3장 Test 15
 * 
 * 함수를 파라미터로 전달
 */

// add 함수
function add( a, b, callback) { // 파라미터로 callback 함수 할당 = 1급 객체라서 가능!!
	// return a + b; 보통 이렇게 해서 결과값을 리턴하는데..
    var result = a + b; // 리턴하는 구문이 존재하게 끔 하지 않았다.
	callback(result);
}
 
// add 함수 실행
add(10, 10, function(result) { // function(result) = 익명함수
	console.log('파라미터로 전달된 콜백 함수 호출됨.');
	console.log('더하기 (10, 10)의 결과 : %d', result);
});

