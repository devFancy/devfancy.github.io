---
layout: post
title:  " 정규 표현식 "
categories: AlgorithmSkill
author: devFancy
---
* content
{:toc}

> `정규 표현식`은 **특정한 규칙을 가진 문자열의 집합을 표현**하는 데 사용하는 형식 언어이다. -위키백과-
> 
>  어떤 텍스트 내에서 **특정한 형태나 규칙을 가진 문자열** 을 찾기 위해 그 형태나 규칙을 나타내는 패턴을 정의하는 식이다.

## Matcher 클래스

* Matcher 클래스는 **대상 문자열의 패턴을 해석하고 주어진 패턴과 일치하는지 판별**할 때 주로 사용된다.

* Matcher 클래스의 입력값으로는 CharSequence라는 새로운 인터페이스가 사용되는데 이를 통해 다양한 형태의 입력 데이터로부터 문자 단위의 매칭 기능을 지원 받을 수 있다.

* Matcher객체는 Pattern객체의 matcher() 메소드를 호출하여 받아올 수 있다.

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexExample {
	public static void main(String[] args)  {
            Pattern pattern = Pattern.compile("^[a-zA-Z]*$"); //영문자만
            String val = "abcdef"; //대상문자열
	
            Matcher matcher = pattern.matcher(val);
            System.out.println(matcher.find());
	}
}
```

위 예제는 Matcher 클래스의 find() 메서드를 활용하여 **대상문자열이 영문자인지 검증**하는 예제이다.

영문자가 맞다면 ture 그렇지 않다면 false가 출력된다.


### Matcher 클래스 주요 메서드

* `matches()` : 대상 문자열과 패턴이 일치할 경우 true 반환한다.

* `find()` : 대상 문자열과 패턴이 일치하는 경우 true를 반환하고, 그 위치로 이동한다.

* `find(int start)` : start위치 이후부터 매칭검색을 수행한다.

* `start()` : 매칭되는 문자열 시작위치 반환한다.

* `start(int group)` : 지정된 그룹이 매칭되는 시작위치 반환한다.

* `end()` : 매칭되는  문자열 끝 다음 문자위치 반환한다.

* `end(int group)` : 지정되 그룹이 매칭되는 끝 다음 문자위치 반환한다.

* `group()` : 매칭된 부분을 반환한다.

* `group(int group)` : 매칭된 부분중 group번 그룹핑 매칭부분 반환한다.

* `groupCount()` : 패턴내 그룹핑한(괄호지정) 전체 갯수를 반환한다.


## Pattern 클래스

* 정규 표현식에 대상 문자열을 검증하는 기능은 `import java.util.regex.Pattern` 클래스의 matches()메소드를 활용하여 검증할 수 있다.

* matches() 메서드의 첫번째 매개값은 정규표현식이고 두번째 매개값은 검증 대상 문자열이다.

* 대상문자열이 정규표현식과 일치하면 true, 그렇지 않으면 false값을 리턴한다.

* `^[0-9]*$`  : 숫자만

```java
import java.util.regex.Pattern;

public class RegexExample {
	public static void main(String[] args)  {
    
            String pattern = "^[0-9]*"; //숫자만
            String val = "123456789"; //대상문자열
        
            boolean regex = Pattern.matches(pattern, val);
            System.out.println(regex);
    }
}
```

예제는 Pattern클래스의 matches() 메서드를 활용하여 **대상문자열이 숫자인지 아닌지 검증**하는 예제이다.

대상문자열이 숫자가 맞다면 ture 그렇지 않다면 false가 출력된다.


### Pattern 클래스 주요 메서드


* `compile(String regex)` : 주어진 정규표현식으로부터 **패턴**을 만듭니다.

* `matcher(CharSequence input)` : 대상 문자열이 패턴과 일치할 경우 **true**를 반환합니다.

* `asPredicate()` : 문자열을 일치시키는 데 사용할 수 있는 술어를 작성합니다.

* `pattern()` : 컴파일된 정규표현식을 **String** 형태로 반환합니다.

* `split(CharSequence input)` : 문자열을 주어진 인자값 CharSequence 패턴에 따라 분리합니다.


### 자주 쓰이는 패턴

```
1) 숫자만 : ^[0-9]*$

2) 영문자만 : ^[a-zA-Z]*$

3) 한글만 : ^[가-힣]*$

4) 영어 & 숫자만 : ^[a-zA-Z0-9]*$

5) E-Mail : ^[a-zA-Z0-9]+@[a-zA-Z0-9]+$

6) 휴대폰 : ^01(?:0|1|[6-9]) - (?:\d{3}|\d{4}) - \d{4}$

7) 일반전화 : ^\d{2,3} - \d{3,4} - \d{4}$

8) 주민등록번호 : \d{6} \- [1-4]\d{6}

9) IP 주소 : ([0-9]{1,3}) \. ([0-9]{1,3}) \. ([0-9]{1,3}) \. ([0-9]{1,3})
```

* `^` : 문자열의 시작 (맨앞) - 문자열이 맨 앞에 오는지 판단

* `*` : 앞 문자가 없을 수도 무한정 많을 수도 있다.

* `$` : 문자열의 종료(맨뒤) - 문자열이 맨 뒤에 오는지 판단

* `[0-9]*` 또는 `[0-9]+` : 숫자가 포함되는지 판단

  * 대괄호안에 숫자를 넣는다 (0-9로 숫자범위를 표현한다)

  * `*`는 숫자가 0개이상 있는지 확인한다.

  * `+`는 숫자가 1개이상 있는지 확인한다.

* `\d`: 숫자만을 의미한다. (숫자 ([0-9]와 동일))

* `\D`: 숫자를 제외한 모든 문자를 의미한다.

* `{}`: 횟수나 범위를 의미한다.

#### 예시) 아이디, 비밀번호

회원가입할 때 자주 나오는 `아이디`와 `비밀번호`에 대한 유효성 검사에도 위의 정규 표현식을 사용한다.

* 예시) 아이디는 **5글자 이상, 15글자 이하의 문자열**이어야 하며 **알파벳 소문자와 숫자만** 을 사용해야 한다.

```
private static final Pattern ID_PATTERN = Pattern.compile("^[a-z0-9]{5,15}$");
```

* 예시) 비밀번호는 **8글자 이상, 16글자이하의 문자열**이어야 하며 **알파벳 대/소문자, 숫자, 특수기호(!@#$)** 을 사용해야 한다. 그리고 알파벳, 숫자, 특수기호는 각각 **하나 이상은 반드시 사용**해야 한다.

```
private static final Pattern PW_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\\$]).{8,16}$");
```

* `?=.*\d` : 해당 문자열안에 숫자를 포함하는지 확인한다.