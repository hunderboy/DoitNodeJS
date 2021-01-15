/**
 * 3장 Test 12
 * 
 * 배열 앞에 요소를 추가하거나 삭제하기
 * shift()와 unshift() 메소드 사용
 */

var Users = [{name:'소녀시대',age:20},{name:'걸스데이',age:22}];
console.log('unshift() 호출 전 배열 요소의 수 : %d', Users.length);

Users.unshift({name:'티아라',age:23}); // 배열의 맨앞에 추가
console.log('unshift() 호출 후 배열 요소의 수 : %d', Users.length);

console.dir(Users);

var elem = Users.shift(); // 배열의 맨앞을 빼버림
console.log('shift() 호출 후 배열 요소의 수 : %d', Users.length);

console.log('shift 으로 꺼낸 세번재 원소');
console.dir(elem);

 

