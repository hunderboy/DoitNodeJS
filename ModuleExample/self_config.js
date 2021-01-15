
module.exports = { // 객체를 만들면서 할당하는 방식
	server_port: 3000, // 서버 포트 번호
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./self_user_schema', collection:'users3', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	    //===== User =====//
	    {file:'./user', path:'/process/login', method:'login', type:'post'}					// user.login 
	    ,{file:'./user', path:'/process/adduser', method:'adduser', type:'post'}				// user.adduser 
	    ,{file:'./user', path:'/process/listuser', method:'listuser', type:'post'}			// user.listuser 
	]
}