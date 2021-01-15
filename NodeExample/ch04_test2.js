
/**
 * 4장 Test 2
 * 
 * event 사용하기
 */
// process는 eventemitter를 이미 상속 받고 있음
// process 는 어디서는 사용가능 consloe 처럼, 이벤트를 이미 상속 on 메소드 사용
process.on('exit', function() { // 'exit' 이라고 하는 이벤트를 받고, 익명함수에서 처리하겠다.
	console.log('exit 이벤트 발생함.');
});

// 일정시간 진행하는 함수 실행
setTimeout(function() {
	console.log('2초 후에 시스템 종료 실행되었음.');
	
	process.exit();
}, 2000);

console.log('2초후에 실행 될 것임.');