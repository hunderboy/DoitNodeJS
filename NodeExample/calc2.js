var calc = {};  // 객체는 중괄호로 만든다.

calc.add = function(a,b) { // 변수에 함수를 할당하고 ()에 입력값 설정한다.
    return a + b;  
};

module.exports = calc; // 위의 코드에서 만들어진 calc 객체를 그대로 밖으로 보낸다.