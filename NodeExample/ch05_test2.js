/**
 * 5장 Test 2
 * 
 * 클라이언트가 웹서버로 요청할 때 이벤트 처리하기
 * 
 */

var http = require('http');

// 웹서버 객체를 만듭니다.
var server = http.createServer();

// 웹서버를 시작하여 3000번 포트에서 대기하도록 합니다.
var host = '192.168.219.189';
var port = 3000;
server.listen(port, host, 50000, function() {
	console.log('웹서버가 시작되었습니다. : %d', port);
});

// 클라이언트 연결 connection이벤트 처리 => 함수 처리
server.on('connection', function(socket) {// on함수로 이벤트 받는다. socket 연결
	console.log('클라이언트가 접속했습니다. : %s, %d', socket.remoteAddress, socket.remotePort);
});

// 클라이언트 요청 request이벤트 처리
server.on('request', function(req, res) {// req:요청객체, res:응답객체
	console.log('클라이언트 요청이 들어왔습니다.');
//	console.dir(req);// 요청 객체 그대로 표시
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write('<h1>웹서버로부터 받은 응답 </h1>');
    res.end();
});

// 서버 종료 이벤트 처리
server.on('close', function() {
	console.log('서버가 종료됩니다.');
});

