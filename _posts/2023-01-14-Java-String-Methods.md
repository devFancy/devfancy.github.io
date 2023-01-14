---
layout: post
title:  " String 특징과 String 클래스의 주요 메소드 "
categories: Java
author: fancy96
---
* content
{:toc}

## String의 생성과 특징

* String 클래스는 문자열을 나타내며, 스트링 리터럴은 String 객체로 처리된다.

* String 객체는 다음과 같이 생성할 수 있다.

``` java
String str1 = "home" // 스트링 리터럴로 스트링 객체 생성
char data[] = {'h', 'o', 'm', 'e'};
String str2 = new String(data);
String str2 = new String("home"); // str2과 str3은 모두 "home" 문자열
```

### 스트링 리터럴과 new String()

* 스트링 리터럴과 new String()으로 생성된 스트링은 서로 다르게 관리된다. 

![스트링 리터럴과 new String()으로 생성된 스트링 객체 비교](/assets/img/java/java_string_methods.png)

* `스트링 리터럴`은 자바 내부에서 리터럴 테이블로 특별히 관리하여, 동일한 리터럴은 공유시킨다.

* 그러나 `new String()`에 의해 생성된 스트링은 `Heap 메모리`에 별도로 생성한다.

* 리터럴을 공유시키는 이유는 **스트링 생성에 대한 실행 시간을 줄이기 위해서**이다.

### 스트링 객체는 수정이 불가능하다.

* 스트링 리터럴, new String()으로 생성했던 스트링 객체는 **수정이 불가능하다**.

* 그러므로 스트링 리터럴을 공유해도 한번 만들어진 스트링은 고칠 수 없기 때문에 문제가 발생하지 않는다.

## String 활용

### 스트링 비교, equals()와 compareTo()

* 스트링 비교에서 == 연산자를 절대 사용해서는 안되며, 대신 String 클래스의 **equals() 메소드**를 사용해야 한다.

* equals() 메소드는 스트링이 같으면 true, 아니면 false를 리턴한다.

``` java
String java = "Java";
if(java.equals("Java")) // true
```

* String 클래스의 compare() 메소드를 사용하면 같은지, 큰지, 작은지를 모두 판단할 수 있다.

* `compareTo(String 비교대상)` 메소드는 현재 스트링과 비교대상 스트링을 사전 순서로 비교하여 같으면 0, 비교대상보다 작으면 -1, 비교대상보다 크면 1을 반환한다.

### 공백 제거, trim()

* 파일로부터 스트링을 입력받을 때, 스트링 앞뒤에 공백이 끼는 경우가 있다.

* trim()은 스트링 앞뒤에 있는 공백 문자를 제거한 스트링을 리턴한다.

``` java
String a = " Hello nice to meet you\t";
String b = a.trim(); // b = "Hellonicetomeetyou". 스페이스와 `\t` 제거됨
```

## String 클래스의 주요 메소드

* `char charAt(int index)` - index 인덱스에 있는 문자 값 리턴
  
  * 문자열 중에서 한 글자만 선택하는 경우 사용한다.

* `String toLowerCase()` - 소문자로 변경한 스트링 리턴 / `String toUpperCase()` - 대문자로 변경한 스트링 리턴

  * 대소문자가 섞여있는 문자열을 소문자로 변환할 때 사용한다.

* `int length()` - 스트링의 길이(문자 개수) 리턴

  * 참고로, 배열로 선언된 String은 `length`로 사용한다.
  
* 예시) 문자열 내 p와 y의 개수 (갯수가 같으면 true, 다르면 false 리턴)
  
``` java
class Solution {
    boolean solution(String s) {
        s = s.toLowerCase();
        int count = 0;

        for (int i = 0; i < s.length(); i++) {

            if (s.charAt(i) == 'p')
                count++;
            else if (s.charAt(i) == 'y')
                count--;
        }

        if (count == 0)
            return true;
        else
            return false;
    }
}
```

* `String [] split(String regex)` - 정규식 regex에 일치하는 부분을 중심으로 스트링을 분리하고 분리된 스트링을 배열에 저장하여 리턴

  * 문자열을 배열로 전환할 때 사용한다.

* 예시)

``` java
class Solution {
boolean solution(String s) {
	String [] arr = s.toLowerCase().split("");
}
```

* `boolean contains(CharSequence s)` - s에 지정된 문자들을 포함하고 있으면 true 리턴

* `String replace(CharSequence target, CharSequence replacement)` - target이 지정하는 일련의 문자들을 replacement가 지정하는 문자들로 변경한 스트링 리턴

* `String subString(int beginIndex)` - beginIndex 인텍스부터 시작하는 서브 스트링 리턴

    * 문자열을 원하는 위치에서 잘라야 하는 경우에 쓰이는 메소드이다.
  
* 예시)
  
``` java
String str = "0123456789";
str.substring(5); // 결과 : 56789
```

* index 값이 5인 위치 이후 값을 가져오라고 했기 때문에 56789를 리턴하게 된다.

* `String subString(int beginIndex, int endIndex) - beginIndex 부터 endIndex 전까지 서브 스트링 리턴

* 예시)

``` java
String str = "123456789";
str.substring(5,10); // 결과 :6789
```

* 예시) 자릿수 더하기 - 자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return하는 solution 함수

``` java
public class Solution {
    public int solution(int n) {
        int answer = 0;
        String s = Integer.toString(n); //int n을 String으로 변환
        
        for(int i=0; i<s.length(); i++){
            answer += Integer.parseInt(s.substring(i, i+1));
        }
        return answer;
    }
}
```

* `String concat(String str)` - str 스트링을 현재 스트링 뒤에 덧붙인 스트링 리턴

* 예시

``` java
a = a.concat(b); // 문자열 연결 (a = "Hello", b = "friends") => "Hellow friends"
```

* `String trim()` - 스트링 앞뒤의 공백 문자들을 제거한 스트링 리턴
