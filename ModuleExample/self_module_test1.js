// require() 메소드는 exports 객체를 리턴함
var user = require('./self_user1');
/*
user 객체에는 exports(self_user1의) 가 할당되었다고 생각하면 된다.
속성으로 
1. getUser 라는 함수와
2. group 라는 객체가 들어가 있다.
*/

function showUser() {
	return user.getUser().name + ', ' + user.group.name;
}

console.log('사용자 정보 : %s', showUser());



