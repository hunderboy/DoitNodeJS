
/**
 * 4장 Test 3
 * 
 * event 사용하기
 */

process.on('tick', function(count) {
	console.log('tick 이벤트 발생함 : %s', count);
});

setTimeout(function() {
	console.log('2초 후에 tick 이벤트 전달 시도함.');
	
	process.emit('tick', '2');// tick 이벤트 실행
}, 2000); // 2초후에 실행되는 setTimeout

