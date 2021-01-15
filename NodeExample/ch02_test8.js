var path = require('path'); // 파일 경로 에 특정한 정보를 확인할때 사용

var directories = ['Users', 'Mars', 'docs']; // 배열
var dirStr = directories.join(); // join 함수 => Users,Mars,docs 형태로 만든다.
console.log('dir :' + dirStr);

var dirStr2 = directories.join(path.sep); // join 함수 => Users\Mars\ docs 형태로 만든다.
console.log('dir2 :' + dirStr2);

// 제일 많이 사용하는 형태 => 파일의 경로를 만들기 위해 자주 이방법을 사용한다.
var dirStr3 = path.join('/Users/Mars', 'notepad.exe'); // \Users\Mars\notepad.exe
console.log('dir3 :' + dirStr3);

var filepath = path.join('/Users/Mars', 'notepad.exe'); // \Users\Mars\notepad.exe
console.log('filepath :' + filepath);


var dirname = path.dirname(filepath); // 파일명을 제외한 디렉토리 경로
console.log('dirname :' + dirname);
var basename = path.basename(filepath); // 파일명
console.log('basename :' + basename);
var extname = path.extname(filepath); // 확장자
console.log('extname :' + extname);


