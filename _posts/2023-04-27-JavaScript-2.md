---
layout: post
title: " 자바스크립트 기초(2) - 조건문, 반복문, 객체 "
categories: JavaScript
author: fancy96
---
* content
{:toc}

> 이 글의 목표는 자바스크립트의 대략적인 문법을 살펴보는데 맞춰져 있다. 깊은 지식은 나중에 기회가 된다면 별도의 포스팅으로 다룰 것이다.

## 조건문

* 어떤 프로그래밍 언어든 코드는 **의사 결정**을 내리고 입력 내용에 따라 작업을 수행해야 한다.

* 예를 들어 한국의 주식 시장은 오전 9시부터 열리고, 오후 3시 30분에 종료된다.

### if ... else 문

#### 기본 if ... else 문법

* 기본 `if...else`문법은 의사 코드(pseudocode, 슈도 코드)로 다음과 같다.

```markdown
if(조건) {
    코드 A : 만약 조건(condition)이 참일 경우
} else {
    코드 B : 참이 아닌 경우 실행할 다른 코드
}
```

* 위를 살펴보면 `if` 조건문에 참인 경우 {} 안의 코드가 실행되고, 참이 아닌 경우는 else {} 안의 코드가 실행된다.

* 정리하자면, "만약 조건이 **true**면, 코드 A를 실행하고, **아니면** 코드 B를 실행한다." 라고 말한다. 

* 한 가지 기억해야 할 점은 `else`와 두 번째 중괄호를 포함하지 않아도 된다. 

```markdown
if (조건) {
  만약 조건(condition)이 참일 경우 실행할 코드
}

실행할 다른 코드
```

* 하지만, 여기서 주의해야할 점은 코드의 **두 번째 블록(실행할 다른 코드)** 은 조건문에 의해서 제어되지 않아서, 조건이 `true` 혹은 `false`를 리턴하는 것에 관계없이 **항상** 동작한다.

* 문법을 잘 이해하기 위해서 **실제 예시**를 알아보자.

* 상황 설명: 팬시가 과자가게에 가서 쿠키를 사려 하는데, 가격이 3,000원이다. 

    지갑에 들어있는 돈은 5,000원이다.

```javascript
let wallet = 5000;
let cookie = 3000;

if(wallet >= cookie) {
    console.log("남은 잔액은" + wallet - cookie + "입니다.");    // 2,000원
} else {
    console.log("잔액이 부족합니다.");
}
``` 

* 위의 코드는 true 이므로 `남은 잔액은 2,000원 입니다.`으로 출력된다.

* 만약, 지갑에 들어있는 돈이 3,000원보다 작으면, `잔액이 부족합니다.` 로 출력된다.

#### else if

* if-else 문은 두 가지 선택권 또는 결과가 나오는데, 만약 두 가지보다 더 많은 것을 원하는 경우에는 `else if`문을 사용하는 방법이 있다.

* 간단한 **날씨 예보 애플리케이션**의 일부가 될 수 있는 다음의 예시를 살펴보자.

```html
<label for="weather">Select the weather type today: </label>
<select id="weather">
  <option value="">--Make a choice--</option>
  <option value="sunny">Sunny</option>
  <option value="rainy">Rainy</option>
  <option value="snowing">Snowing</option>
  <option value="overcast">Overcast</option>
</select>

<p></p>
```

```javascript
const select = document.querySelector('select');
const para = document.querySelector('p');

select.addEventListener('change', setWeather);

function setWeather() {
  const choice = select.value;

  if (choice === 'sunny') {
    para.textContent = 'It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.';
  } else if (choice === 'rainy') {
    para.textContent = 'Rain is falling outside; take a rain coat and a brolly, and don\'t stay out for too long.';
  } else if (choice === 'snowing') {
    para.textContent = 'The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.';
  } else if (choice === 'overcast') {
    para.textContent = 'It isn\'t raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.';
  } else {
    para.textContent = '';
  }
}
```

* [1] 여기서 HTML `<select>` 엘리먼트를 사용하여 다른 날짜 선택과 간단한 문단을 만들 수 있다.

* [2] 자바스크립트 코드에서 `<select>`와 `<p>` 요소를 모두 저장하고 있고, 값이 변할 때 `setWeather()` 함수가 동작하도록 `<select>` 요소에 이벤트 리스너를 추가했다.

* [3] 함수가 동작했을 때, 현재 `<select>` 요소에서 선택된 현재 값을 `choice`라는 변수에 먼저 설정한다.

    그런 다음 choice 값에 따라 문단 안에 다른 텍스트를 표시하기 위해 조건문을 사용한다.

* [4] `else{...}`안의, 가장 마지막 선택은 기본적으로 "최후의 수단" 옵션이다.

    예를 들어, 사용자가 처음에 표시한 "--Make a choice--" 플레이스홀더 옵션을 다시 선택한다면, 문단의 텍스트를 비우는 역할을 한다.

(예시1) 'Sunny' 를 선택한 경우

![](/assets/img/javaScript/javaScript_2_1.png)

(예시1) "--Make a choice--" 를 선택한 경우

![](/assets/img/javaScript/javaScript_2_2.png)

#### if ... else 중첩

* `if...else` 문을 또 다른 문 앞에 넣는 것도 가능하다.

* 예를 들어, **날씨**를 확인하는 것 뿐만 아니라 그 안에 **온도**를 기준으로 조건문을 들 수 있다.

```javascript
if (choice === 'sunny') {
  if (temperature < 86) {
    para.textContent = 'It is ' + temperature + ' degrees outside — nice and sunny. Let\'s go out to the beach, or the park, and get an ice cream.';
  } else if (temperature >= 86) {
    para.textContent = 'It is ' + temperature + ' degrees outside — REALLY HOT! If you want to go outside, make sure to put some suncream on.';
  }
}
```

#### 논리 연산자: AND, OR 그리고 NOT

* 만약 중첩된 `if...else문`을 작성 없이 **다양한 조건을 테스트**하길 원한다면 **논리 연산자**를 사용하면 된다.

    * `&&` - AND : 전체 표현식이 **모두 참**이면, true로 리턴하고 그게 아니라면 false를 리턴하게 된다.

    * `||` - OR : 전체 표현식 중에 **둘 중 하나가 참**이면, true로 리턴하고 그게 아니라면 false를 리턴하게 된다.

* AND 예시를 위해서 앞의 예제 코드를 다음과 같이 재작성할 수 있다.

```javascript
if (choice === 'sunny' && temperature < 86) {
  para.textContent = 'It is ' + temperature + ' degrees outside — nice and sunny. Let\'s go out to the beach, or the park, and get an ice cream.';
} else if (choice === 'sunny' && temperature >= 86) {
  para.textContent = 'It is ' + temperature + ' degrees outside — REALLY HOT! If you want to go outside, make sure to put some suncream on.';
}
```

### switch 문

* `if...else` 문은 조건문 코드를 잘 작성하면, 정상적으로 동작하지만 단점이 없지 않아 있다.

* `if...else` 문은 두 가지 선택을 가지고 있고, 각각(if, else)은 실행될 합리적인 코드를 작성하는 경우 유용하지만, **한 변수에 대해서 여러 값을 비교하고자 하는 경우**에는 코드의 길이가 길어지면서 가독성이 좋지 않게 되는 단점이 있다.

* 이런 단점을 해결하기 위해 나온 것이 `switch` 문이다.

* `switch` 문을 사용하여 **날씨 예보 애플리케이션**을 재작성하면 다음과 같다.

```html
<label for="weather">Select the weather type today: </label>
<select id="weather">
  <option value="">--Make a choice--</option>
  <option value="sunny">Sunny</option>
  <option value="rainy">Rainy</option>
  <option value="snowing">Snowing</option>
  <option value="overcast">Overcast</option>
</select>

<p></p>
```

```javascript
const select = document.querySelector('select');
const para = document.querySelector('p');

select.addEventListener('change', setWeather);


function setWeather() {
  const choice = select.value;

  switch (choice) {
    case 'sunny':
      para.textContent = 'It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.';
      break;
    case 'rainy':
      para.textContent = 'Rain is falling outside; take a rain coat and a brolly, and don\'t stay out for too long.';
      break;
    case 'snowing':
      para.textContent = 'The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.';
      break;
    case 'overcast':
      para.textContent = 'It isn\'t raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.';
      break;
    default:
      para.textContent = '';
  }
}
```

## 반복문

* 반복문을 사용하는 이유는 **같은 것을 계속, 그리고 다시 하는 경우**에 사용한다. 

* 예시로, 1부터 10까지의 합을 반복문을 이용한다면 다음과 같이 작성된다.

```javascript
let sum = 0;
for (let i = 1; i <= 10; i++) {
	sum += i;
}
console.log(sum); // 55
```

### 반복문의 표준

* 반복문의 작성 형태는 `초기화식`, `조건식`, `증감식` 순으로 구성된다.

![](/assets/img/javaScript/javaScript_2-3.png)

* 번호는 반복문이 실행될 때의 **순서**를 의미하며, 순서에 따라 반복문이 동작하게 된다.

```javascript
const cats = ['Bill', 'Jeff', 'Pete', 'Biggles', 'Jasmin'];
let info = 'My cats are called ';
const para = document.querySelector('p');

for (let i = 0; i < cats.length; i++) {
  info += cats[i] + ', ';
}

para.textContent = info;
```
* 위의 코드를 통해 `My cats are called Bill, Jeff, Pete, Biggles, Jasmin,` 이라는 결과를 보여준다.

### break로 반복문 종료하기

* 만약 모든 반복문이 완료되기 전에 반복문을 종료하고 싶다면, break 문을 사용하면 된다.

* 찾고자 하는 `사용자 이름`을 검색해서 그 사용자와 관련된 `핸드폰 번호`를 반환하는 경우는 다음과 같이 코드를 작성할 수 있다.

```html
<label for="search">Search by contact name: </label>
<input id="search" type="text">
<button>Search</button>

<p></p>
```

```javascript
const contacts = ['Chris:2232322', 'Sarah:3453456', 'Bill:7654322', 'Mary:9998769', 'Dianne:9384975'];
const para = document.querySelector('p');
const input = document.querySelector('input');
const btn = document.querySelector('button');

btn.addEventListener('click', function() {
  let searchName = input.value;
  input.value = '';
  input.focus();
  for (let i = 0; i < contacts.length; i++) {
    let splitContact = contacts[i].split(':');
    if (splitContact[0] === searchName) {
      para.textContent = splitContact[0] + '\'s number is ' + splitContact[1] + '.';
      break;
    } else {
      para.textContent = 'Contact not found.';
    }
  }
});
```

![](/assets/img/javaScript/javaScript_2_4.png)

* `Chris`를 입력해서 Search 버튼을 클릭하면, Chris에 해당하는 핸드폰 번호를 출력하고 반복문은 종료되어 두 번째 부터는 검색해도 결과가 출력되지 않는다.

### Continue로 반복 건너뛰기

* continue 문은 반복문을 완전히 탈출하는 대신, 반복문의 다음 반복으로 건너뛰는 문법이다.

* 예를 들어 1부터 10까지 출력하는 for 문에서 숫자 7를 제외하고 출력하는 경우는 아래와 같이 코드를 작성할 수 있다.

```javascript
var num;
for(num = 1; num <= 10; num++) {
    if(num == 7) {
        continue;   // num이 7인 경우 건너뛴다.
    }
    document.write(num, " ");
}
```

* 결과: `1 2 3 4 5 6 8 9 10`

### while / do ... while

* while 문은 조건식을 확인한 다음에 true이면, {} 안에 코드를 실행하는 문법이다.

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>JavaScript</title>
  </head>
  <body>
    <p>
      <script>
        var i = 0;
        while ( i < 10 ) {
          document.write( i + ' ' );
          i++;
        }
      </script>
    </p>
  </body>
</html>
```

* do-while 문은 반드시 한 번 실행한 다음에 조건식을 확인하는 문법이다.

```javascript
var i = 0;
do {
  // do something
  i++;
} while ( i < 10 )
```

## 객체

* `객체`는 여러 값(주로 기본형)들을 묶어서 한 번에 관리하기 위함이다.

* 보통은 객체 안에는 여러 데이터와 함수로 이루어져 있고, 다른 말로는 **프로퍼티와 메서드**라고 부른다.

* javaScript에서는 객체를 생성하는 방식으로 크게 2가지가 있다.

### Object 생성자 함수 이용

```javascript
const mouse = new Object();

mouse.name = 'fancy';
mouse.age = 27;
mouse.color = 'black';

console.log(typeof mouse); // object
console.log(mouse); // {name: 'fancy', age: 27, color: 'brown'}
```

### 객체 리터럴 이용

* `literal`은 표기법 또는 값 그 자체를 의미하고, `객체 리터럴`은 객체를 생성하는 표기법을 의미한다.

* { }(중괄호) 를 활용하여 객체를 생성하며, { } 안에 내용이 없는 경우에는 빈(Empty) 객체가 생성된다.

```javascript
const empty = {}; // empty 'object'

const mouse = {  // {name: 'fancy', age: 27, color: 'black'}
	name : 'fancy',
	age : 27,
	color : 'black'
};
```

* 객체 리터럴을 사용해서 객체를 생성하는 것은 **연속된 구조체**나 **연관 데이터를 일정한 방법으로 변환**하고자 할 때 많이 쓰이는 방법이다.

### 점 표기법

* 위에서 봤겠지만, 기본적으로 객체의 프로퍼티와 메서드를 **점 표기법**을 통해 접근한다.

* 객체 이름(person)은 **네임스페이스**처럼 동작한다. `네임스페이스`란 구분이 가능하도록 정해놓은 범위나 영역을 뜻한다. 말 그대로 이름 공간을 선언하여 다른 공간과 구분하도록 한다.

* 객체내에 캡슐화가 되어있는 것에 접근하려면 먼저 **점**을 입력해야 한다. 그 다음 점을 찍고 **접근하고자 하는 항목** 을 적는다.

* 간단한 프로퍼티의 이름일 수도 있고, 배열의 일부이거나 객체의 메서드를 호출할 수도 있다.

```javascript
person.age;         // 프로퍼티(속성)
person.interests[1] // 배열의 일부
person.bio()    // 메서드
```

> 하위 namespaces

* 다른 객체를 객체 멤버의 값으로 갖는 것이 가능하다. 

* 예를 들면, 다음과 같은 name 멤버를

```javascript
name: ['Good', 'Fancy']
```

* 아래와 같이 바꿀 수 있다.

```javascript
name : {
    first: 'Good',
    last: 'Fancy'
}
```

* 이렇게 해서 **하위 namespace**를 만들었다.

* 이 속성을 사용하려면 그저 끝에 **다른 점**을 하나 찍어주기만 하면 된다.

```javascript
person.name.first
person.name.last
```

### 괄호 표기법

* 객체의 프로퍼티에 접근하는 다른 방법으로 괄호 표기법을 사용하는 것이 있다.

* 다음과 같이 사용하는 대신

```javascript
person.age
person.name.first
```

* 아래와 같이 사용할 수 있다.

```javascript
person['age']
person['name']['first']
```

* 이런 방식은 **배열**속에 있는 항목에 접근하는 방법과 매우 유사해 보이는데, 실제로도 이는 기본적으로 동일한 것이다.

* 객체가 간혹 연관배열(associative arrays)이라고 불리는 것이 당연한다. 연관 배열은 배열이 숫자를 값에 연결하는 것과 같은 방법으로 **문자열을 값에 매핑**하는 의미이다.


## Reference

* [mdn web docs_JavaScript - 조건문](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/conditionals)

* [mdn web docs_JavaScript - 반복문](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Looping_code)

* [mdn web docs_JavaScript - 객체 기본](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Basics)