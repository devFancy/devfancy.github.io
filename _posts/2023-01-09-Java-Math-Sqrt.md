---
layout: post
title:  "제곱근, 제곱을 구할때 쓰는 메서드"
categories: Java
author: devFancy
---
* content
{:toc}

## Math.sqrt()란?

* java.lang.Math클래스의 sqrt() 메서드다.

* double타입의 인수를 전달하면 인수에 대한 double타입의 제곱근 값을 리턴한다.

* 제곱근은 음수가 나올 수 없으므로 음수를 입력하면 NaN(Not a Number)을 리턴한다.

### Math.sqrt() 사용방법

* Math.Sqrt(double d); ⇒ 사용하여 d의 제곱근을 출력한다.

``` java
public class Sqrt {
    public static void main(String[] args)  {
        double result = Math.sqrt(49); //49의 제곱근
        System.out.println("47의 제곱근 : "+ result); // 결과: 7
    }
}
```

## Math.pow()란?

* 자바에서 특정값의 제곱을 구하려면 java.lang.Math 클래스의 pow()메소드를 사용하면 된다.

``` java
public class Pow {
    public static void main(String[] args)  {

        double result = Math.pow(7, 2); //7의제곱
        System.out.println("7의 제곱은 : "+result); // 결과: 49
    }
}
```

## 실제 적용(정수 제곱근 판별)

[프로그래머스 - 정수 제곱근 판별](https://school.programmers.co.kr/learn/courses/30/lessons/12934)

* 해당 문제에서 Math.sqrt 와 Math.pow를 이용하여 문제를 해결하였다.

* 처음에는 어떤 값의 제곱근을 판별하는 방법이 떠오르지 않아서 아래와 같은 방법으로 사용하였고, 다른 풀이에서는 sqrt와 pow만으로 판별하는 방법을 알게되어서 또 하나의 배움을 얻었다.

### 어떤 값이 정수인지 확인하는 방법

``` java
if(number%1 == 0){
	println("It is an integer");
} else {
	println("It is not an integer");
}
```

### 첫번째 풀이

``` java
class Solution {
    public long solution(long n) {
        long answer = 0;
        double result = Math.sqrt(n);
        if(result % 1 == 0) {
            answer = ((long)result+1) * ((long)result+1);
        } else 
            answer = -1;
        return answer;
    }
}
```

### 다른 풀이

``` java
class Solution {
  public long solution(long n) {
      if (Math.pow((int)Math.sqrt(n), 2) == n) {
            return (long) Math.pow(Math.sqrt(n) + 1, 2);
        }

        return -1;
  }
}
```