---
layout: post
title: " 자바스크립트 기초(1) - 변수, 자료형, 연산자 "
categories: Javascript
author: fancy96
---
* content
{:toc}

## 변수

### 변수란

* `변수`란 어떤 프로그램에서 사용할 일련의 값(숫자, 문자, true/false)을 **잠시 보관해두기 위한 공간**이자,

    **값 그 자체**라고 보면 된다.

* 온라인 쇼핑몰 애플리케이션을 구축하는 경우 **상품이나 방문객 등의 정보를 저장할 때** 변수를 사용한다.

* 자바스크립트에선 `let` 키워드를 사용해 변수를 생성한다.

```javascript
let message;
```

* 위의 문은 'message'라는 이름을 가진 변수를 생성한다는 의미이다.

  (생성된 변수는 보통 한 번만 사용하지 않고, 재사용(Reusable)하는 경우가 더 많다)

* 아래의 문은 할당 연산자 `=`를 사용해 변수 안에 데이터를 저장한다는 의미이다.

```javascript
let message;

message = 'Hello'; // 문자열 저장
```

* 변수를 사용하면 컴퓨터 내 **메모리 공간**에 값을 저장해두고 필요할 때 다시 사용할 수 있다.

* 그리고 아래와 같이 **변수 선언과 값 할당을 한 줄에 작성**할 수도 있다.

```javascript
let message = 'Hello!'; // 변수를 정의하고 값을 할당
alert(message); // Hello
```

* 한 줄에 여러 변수를 선언하는 것도 가능하다.

```javascript
let user = 'fancy', age = 27, message = 'Hello';
```

* 이렇게 작성하면 코드가 짧아지긴 하지만, 권장하는 방법은 아니다.

* **가독성을 위해 한 줄에는 하나의 변수를 작성**하는게 좋다.

* 한 줄에 한 개의 변수를 작성하면, 코드가 길어지지만 읽기에는 편하다.

```javascript
let user = 'fancy';
let age = 27;
let message = 'Hello';
```

### 동적 타입

* JavaScript는 느슨한 타입의 동적 언어이다.

* JavaSccript의 변수는 어떤 특정 타입과 연결되지 않으며, 모든 타입의 값으로 할당 가능하다.

```javascript
let food = 1000 // 숫자형
foo = 'bar'     // 문자형
foo = true;     // boolean형
```

### let 대신 Var

* 만들어진 지 오래된 스크립트에서는 `let` 대신 `var`라는 키워드를 발견하는 경우가 있다.

```javascript
var message = 'Hello';
```

* `var`는 `let`과 거의 동일하게 동작하지만, `오래된` 방식이다.

* 미묘한 차이점은 [여기](https://ko.javascript.info/var)에서 확인하자.

## 자료형

* Javascript에서 사용하는 데이터 타입은 **원시 값과 객체**로 나뉜다.

  * 원시 값(불변 데이터) - Boolean 타입, Null 타입, Undefined 타입, Number 타입, Blight 타입, String 타입, Symbol 타입

  * 객체(속성의 컬렉션)

### 원시 값

* 원시 값은 객체를 제외한 모든 타입의 **불변 값(변경할 수 없는 값)** 을 정의한다.

#### Boolean 타입

* Boolean 타입은 **논리 요소** 를 나타내며, `true`와 `false` 두 가지 값을 가질 수 있다.

* Boolean 아닌 값을 변환할 때 Boolean 함수를 사용한다. 단, **`Boolean` 객체**를 사용해선 안된다.

```javascript
var x = Boolean(expression);     // 추천
var x = new Boolean(expression); // 사용하지 말것
```

#### Null 타입

* null 값은 일반적으로 존재하지 않거나, 유효하지 않는 object 또는 주소를 의도적으로 가리키는 참조를 나타낸다.

* 하지만 `typeof` 연산자를 사용할 때는 `object`를 반환한다.

```javascript
console.log(typeof null); // "object"
```

#### Undefined 타입

* Undefined 타입은 값을 할당하지 않은 변수는 `undefined` 값을 가진다.

```javascript
var x; // 값을 할당하지 않고 변수 선언

console.log("x's value is", x) // "x's value is undefined" 출력
```

#### Number 타입

* Number 타입은 일상에서 사용할 수 있는 대부분의 범위의 숫자 값을 의미한다.

#### BigInt 타입

* String 타입은 텍스트 데이터를 나타낼 때 사용한다.

* C 언어와 같은 일부 프로그래밍 언어와 달리 JavaScript 문자열은 불변하다.

* 즉, 문자열을 생성한 후 바꾸는 것은 불가능하다.

* 그러나 **원본 문자열을 사용해 새로운 문자열을 생성하는 것은 가능**하다.

* [1] 원본 문자열에서 각각의 문자열을 선택하거나 `String.substr()`을 사용하여 생성한 부분 문자열인 경우

```javascript
const str = 'hello';

console.log(str.substr(1, 2));
// Expected output: "el"

console.log(str.substr(2));
// Expected output: "llo"
```

* [2] 연결 연산자(`+`)을 사용하거나 `String.concat()`을 사용하여 두 개의 문자열을 합친 결과물인 경우

```javascript
const str1 = 'Hello';
const str2 = 'World';

console.log(str1.concat(' ', str2));
// Expected output: "Hello World"

console.log(str2.concat(', ', str1));
// Expected output: "World, Hello"
```

#### Symbol 타입

* Symbol 타입은 **고유하고 변경 불가능한 원시 값**이며 객체의 속성 키로 사용할 수 있다.

* 심볼은 객체에 속성을 추가할 때 고유한 키를 부여하여 다른 코드와 충돌하지 않도록 할 때 많이 쓰이며, 

  이렇게 추가한 속성은 일반적인 방법으로는 접근할 수 없으므로 약한 형태의 **캡슐화**, 혹은 **정보 은닉**을 제공한다.

```javascript
const sym1 = Symbol();
const sym2 = Symbol("foo");
const sym3 = Symbol("foo");

Symbol("foo") === Symbol("foo"); // false
```

### 객체

* `객체`란 식별자로 참조할 수 있는 메모리 상의 값을 말한다.

* 여기서 **식별자**는 코드 내의 변수, 함수, 혹은 속성을 식별하는 문자열이다.

* JavaScript에서의 객체 속성은 '키' 값으로 식별하며, 키 값으로는 문자열 값이나 심볼을 사용할 수 있다.

* 자세한 건 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures)를 참고하자.

## 연산자

* 컴퓨터는 기본적인 연산이 가능하며, 거의 모든 프로그래밍 코드는 값과 연산을 기반으로 작성된다고 볼 수 있다.

* `연산자`는 +,-부터 각 프로그래밍 언어 별로 표기법이 서로 다른 연산자 기호를 가지고 사용한다.

* `피연산자`는 주로 **값 그 자체** 혹은 **변수**가 될 수 있다.

### 기본 사칙 연산

* 일반적인 사칙 연산에는 +, -, /, % 등의 연산을 수행한다.

```javascript
// 덧셈 연산
50 + 50
// 뺄셈 연산(음수 출력 가능)
100 - 10
// 곱셈 연산(변수 * 값 연산 가능)
const a = 5;
a * 10
// 나눗셈 연산(변수 / 변수 연산 가능)
const b = 10;
const c = 3; // 소수점 이하 버림 처리.
b / c
// 연산자 적용 우선순위 기본적으로 곱셈이 먼저 연산되지만, ( )를 통해 연산 우선 적용.
(3 + 5) * 2
// 동일한 연산자 간 순서는 왼쪽부터 오른쪽으로 수행
5 - 3 - 1 // 3이 아니고 1,
// 제곱 연산
5 ** 2
```

### =, 할당 연산자

* 10이라는 값을 상수 타입 변수 a에 할당(대입)한다.

```javascript
const a = 5;
```

### %, 나머지 연산

* % 기호인 나머지 연산자를 활용하여 첫 번째 피연산자를 두 번째 피연산자가 나눈 나머지 값을 출력할 수 있다.

* 어떤 값의 짝수 혹은 홀수인지 판별한다.

```javascript
const a = 101

// 짝수 판별
a % 2 == 0

// 홀수 판별
a % 2 != 0
```

### 문자열 연산

* 문자열도 연산이 가능하다. 덧셈을 의미하는 기호인 `+` 연산이 유일하게 가능하고, 문자열 간의 연결도 가능하다.

```javascript
const fruit = 'good';
const snack = 'fancy';

fruit + snack; // goodfancy
```

* 그외 다른 연산자와 연산자 우선순위는 다음 사이트를 참고하자.

  * [그외 다른 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_operators)

  * [연산자 우선순위](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_operators#%EC%97%B0%EC%82%B0%EC%9E%90_%EC%9A%B0%EC%84%A0%EC%88%9C%EC%9C%84)

## Reference

* [JavaScript의 타입과 자료구조](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures)
