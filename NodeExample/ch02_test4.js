var calc = {}; // 객체는 중괄호로 만든다.

calc.add = function(a,b) { // calc객체에 속성 추가 하면서 
                            // 변수에 함수를 할당하고 ()에 입력값 설정한다.
    return a + b;  
};// 중괄호로 함수 정의


console.log('모듈로 분리하기 전 - calc.add : ' + calc.add(10,10) );


