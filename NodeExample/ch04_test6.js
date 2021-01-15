
/**
 * 4장 Test 13
 * 
 * FS 사용하기 : Non-Blocking IO
 */

var fs = require('fs'); // fs 라는 모듈을 불러들입니다.

//파일을 비동기식 IO 방식으로 읽어 들입니다. - 사용하는 방법이 약간 다르다.
fs.readFile('./package.json', 'utf8', function(err, data) {
	// 읽어 들인 데이터를 출력합니다.
	console.log(data);
});

console.log('프로젝트 폴더 안의 package.json 파일을 읽도록 요청했습니다.');

// test5와 같아 보이지만 큰 차이가 있다.
// test5 경우 파일을 읽어들일 때 까지 다른 코드 진행을 대기 시키지만,..
// test6 경우 다 읽든 말든 건너 뛰어 버린다.
