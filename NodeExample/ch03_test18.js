/**
 * 3장 Test 18
 * 
 * 프로토타입 객체 만들기
 */

// 1. 클래스 생성
function Person(name, age) {
	this.name = name;
	this.age = age;
}

// 2. 자바 클래스 메소드 만드는 것처럼
Person.prototype.walk = function(speed) { // prototype 함수 설정하기
	console.log(speed + 'km 속도로 걸어갑니다.');
}

// 3. 객체 생성
var person01 = new Person('소녀시대', 20);
var person02 = new Person('걸스데이', 22);

console.log(person01.name + ' 객체의 walk(10)을 호출합니다.');
person01.walk(10);

