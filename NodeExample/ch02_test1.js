console.log('안뇽');

console.log('숫자입니다. %d', 10);
console.log('문자열 입니다. %s', '하이하이');

var person = {
    name:'소녀시대',
    age:25
};
console.log('자바스크립트 객체입니다. %j', person); // 로그 출력

console.dir(person); // JS 객체 를 그대로 출력
// 라이브러리를 사용 했을때, 코드 진행과정에서 생성될때

console.time('duration_time');
var result = 0;
for (var i = 0; i < 10000; i++){
    result += i;
}

console.timeEnd('duration_time'); // console 객체

console.log('파일 이름 : %s', __filename);  // 파일 총 경로
console.log('패스 : %s', __dirname);  // 파일 경로



