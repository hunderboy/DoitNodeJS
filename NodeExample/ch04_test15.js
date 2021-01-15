
/**
 * 4장 Test 15
 * 
 * 로그 남기기 : winston 모듈을 이용해 로그 남기기
 */

// 3개의 외장 모듈 불러옴
var winston = require('winston'); // 로그 처리 모듈
var winstonDaily = require('winston-daily-rotate-file'); // 로그 일별 처리 모듈
var moment = require('moment'); // 시간 처리 모듈

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); 
    // '2016-05-01 20:14:28.500 +0900' 형태로 포맷 추출
};

var logger = winston.createLogger({ // log 생성하는 객체 winston 외장 모듈의 Logger
    transports: [ // 배열
        new (winstonDaily)({ // winstonDaily 외장모듈을 함수로 실행
            name: 'info-file',
            filename: './log/server',// 현재위치/log/server
            datePattern: 'YYYY-MM-DD',
            colorize: false,// 색상 정보
            maxsize: 50000000, // 파일의 최대 크기 제한
            maxFiles: 1000, // 파일의 최대 개수 제한
            level: 'info',  // info 레벨 까지만 출력을 해라.
            showLevel: true,
            json: false,    // json 포맷으로 출력할건가?
            timestamp: timeStampFormat // 만든 timeStampFormat [함수]를 입력한다.
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',// 디버깅 레벨까지 출력
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: './log/exception',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});// logger 객체 완성

logger.debug('디버깅 메세지 입니다.');
logger.error('에러 메세지입니다.');


var fs = require('fs');

var inname = './output.txt';
var outname = './output2.txt';

fs.exists(outname, function (exists) {
    if (exists) {
    	fs.unlink(outname, function (err) {
    		if (err) throw err;
    		logger.info('기존 파일 [' + outname +'] 삭제함.');
    	});
    }
    
    var infile = fs.createReadStream(inname, {flags: 'r'} );
	var outfile = fs.createWriteStream(outname, {flags: 'w'});

	infile.pipe(outfile);
	logger.info('파일 복사 [' + inname + '] -> [' + outname + ']');
});


