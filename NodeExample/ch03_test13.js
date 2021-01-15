/**
 * 3장 Test 13
 * 
 * 배열의 요소 삭제하기, 요소들을 추가하거나 삭제하기
 * delete 키워드 사용, splice() 메소드 사용
 */

var Users = [{name:'소녀시대',age:20},{name:'걸스데이',age:22},{name:'티아라',age:23}];
console.log('delete 키워드로 배열 요소 삭제 전 배열 요소의 수 : %d', Users.length);

delete Users[1]; // 원소 삭제. 빈공간으로 남겨짐 A, ,C = 이렇게 비어진 상태로 존재함

console.log('delete 키워드로 배열 요소 삭제 후');
console.dir(Users);

Users.forEach(function(elem,index){
    console.log('원소 #' + index);
    console.dir(elem);
})


// 삭제하고 다시 연결된것을 연달아 채워져야 하므로
Users.splice(1, 0, {name:'애프터스쿨',age:25}); // 0 = 추가 의미

console.log('splice()로 요소를 인덱스 1에 추가한 후');
console.dir(Users);

Users.splice(2, 1); // 1개를 삭제 하겟다 , 만약에 3이면 2index 이래로 3개를 연달아 삭제

console.log('splice()로 인덱스 1의 요소를 1개 삭제한 후');
console.dir(Users);




