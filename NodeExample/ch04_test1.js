
/**
 * 4장 Test 1
 * 
 * url 모듈 사용하기
 */
var url = require('url'); // url 모듈 불러옴

// 주소 문자열을 URL 객체로 만들기
var curURL = url.parse('https://m.search.naver.com/search.naver?query=steve+jobs&where=m&sm=mtp_hty');

// URL 객체를 주소 문자열로 만들기
var curStr = url.format(curURL);

console.log('주소 문자열 : %s', curStr);
console.dir(curURL);

console.log('query -> ', curURL.query);


// 요청 파라미터 구분하기
var querystring = require('querystring'); // querystring 모듈 불러옴
var param = querystring.parse(curURL.query);

console.log('요청 파라미터 중 query의 검색어 값 : %s', param.query);
console.log('원본 요청 파라미터 : %s', querystring.stringify(param));

