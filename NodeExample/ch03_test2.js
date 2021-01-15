/**
 * 3장 Test 2
 * 
 * 자바스크립트의 객체 타입
 * 객체는 중괄호를 이용해 만들어지며 그 안에 속성을 추가할 수 있음
 */

var Person = {}; // 자바스크립트의 객체는 중괄호로 만든다!!!

Person['age'] = 20; // 대괄호를 사용해도 되고
Person['name'] = '소녀시대';
Person.mobile = '010-1000-1000';// .속성을 사용해도 된다.

console.log('나이 : %d', Person.age);
console.log('이름 : %s', Person.name);
console.log('전화 : %s', Person['mobile']);

