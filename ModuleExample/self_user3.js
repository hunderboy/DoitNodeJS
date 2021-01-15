// 객체를 그대로 할당할 수 있음
var user = {
	getUser: function() {
		return {id:'test01', name:'소녀시대'};
	},
	group:{id:'group01', name:'친구'}
}
	
module.exports = user;
// exports 에 객체를 할당하는게 문제 되서 module.exports 를 사용한다. 
