/**
 * 모듈에 대해 알아보기
 * 
 * module.exports에 인스턴스 객체를 만들어 할당
 *
 * @date 2016-11-10
 * @author Mike
 */

// 사용 패턴 : module.exports에 인스턴스 객체를 만들어 할당함

/**
자바 스크립트에서는 함수를 생성자로 지정하여 객체를 정의하고, 
그 객체를 사용하여 인스턴스 객체를 만들 수 있다. 

만약 User 객체를 만들고 싶다면,
	1. User 라는 이름의 함수를 먼저 정의 하고
	2. 이 함수의 속성을 설정한다.(id, name)
	
User 객체의 속성으로 함수나 값을 추가하려면 
User.prototype.속성 이러한 꼴의 형태로 
속성으로 추가 하면 된다

이렇게 정의한 User 객체에서 new 연산자를 사용하여 새로운 인스턴스 객체를 만든 후 module.exports에 직접할당
이렇게 하면 불러오는 모듈쪽에서 인스턴스 객체를 바로 참조 가능하다.
 */


// 생성자 함수
function User(id, name) {
	this.id = id;
	this.name = name;
}

User.prototype.getUser = function() {
	return {id:this.id, name:this.name};
}

User.prototype.group = {id:'group1',name:'친구'};

User.prototype.printUser = function() {
	console.log('user 이름 : %s, group 이름 : %s', this.name, this.group.name);
}

module.exports = new User('test01', '소녀시대');
