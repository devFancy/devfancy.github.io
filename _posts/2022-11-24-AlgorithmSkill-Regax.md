---
layout: post
title:  " 정규표현식 "
categories: AlgorithmSkill
author: fancy96
---
* content
{:toc}

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

```markdown
* matches() : 대상 문자열과 패턴이 일치할 경우 true 반환한다.

* find() : 대상 문자열과 패턴이 일치하는 경우 true를 반환하고, 그 위치로 이동한다.

* find(int start) : start위치 이후부터 매칭검색을 수행한다.

* start() : 매칭되는 문자열 시작위치 반환한다.

* start(int group) : 지정된 그룹이 매칭되는 시작위치 반환한다.

* end() : 매칭되는  문자열 끝 다음 문자위치 반환한다.

* end(int group) : 지정되 그룹이 매칭되는 끝 다음 문자위치 반환한다.

* group() : 매칭된 부분을 반환한다.

* group(int group) : 매칭된 부분중 group번 그룹핑 매칭부분 반환한다.

* groupCount() : 패턴내 그룹핑한(괄호지정) 전체 갯수를 반환한다.
```

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

```markdown
* compile(String regex) : 주어진 정규표현식으로부터 패턴을 만듭니다.

* matcher(CharSequence input) : 대상 문자열이 패턴과 일치할 경우 true를 반환합니다.

* asPredicate() : 문자열을 일치시키는 데 사용할 수있는 술어를 작성합니다.

* pattern() : 컴파일된 정규표현식을 String 형태로 반환합니다.

* split(CharSequence input) : 문자열을 주어진 인자값 CharSequence 패턴에 따라 분리합니다.
```

* `^` : 문자열의 시작 (맨앞) - 문자열이 맨 앞에 오는지 판단

* `*` : 앞 문자가 없을 수도 무한정 많을 수도 있다.

* `$` : 문자열의 종료(맨뒤) - 문자열이 맨 뒤에 오는지 판단

* `[0-9]*` 또는 `[0-9]+` : 숫자가 포함되는지 판단

  * 대괄호안에 숫자를 넣는다 (0-9로 숫자범위를 표현한다)

  * `*`는 숫자가 0개이상 있는지 확인한다.

  * `+`는 숫자가 1개이상 있는지 확인한다.


### 자주 쓰이는 패턴

```markdown
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