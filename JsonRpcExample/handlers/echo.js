
/*
 * echo RPC 함수
 * 
 */

// echo 함수
var echo = function(params, callback) {
	console.log('JSON-RPC echo 호출됨.');
    console.log('params => '+ JSON.stringify(params));// 파라미터가 뭐가 왔는지 확인
    console.dir(params);
	
	callback(null, params);
};

module.exports = echo;

