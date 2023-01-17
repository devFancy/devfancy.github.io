---
layout: post
title:  " AssertJ 개념 정리 "
categories: AssertJ
author: fancy96
---
* content
{:toc}

* 테스트코드를 작성하면서 JUnit과 AssertJ 사용법을 익혀야 한다는 사실을 알게 되고 난 이후에 따로 공부를 하게 되었다.

* 그 중 AssertJ 개념을 정리하자.

---

## 개요

* `AssertJ` : Java 테스트에서 유창하고 풍부한 어설션을 작성하는 데 사용되는 오픈 소스 커뮤니티 기반 라이브러리이다.

---

## 메이븐 종속성

``` java
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>3.4.1</version>
    <scope>test</scope>
</dependency>
```

* 이 종속성은 기본 Java 어설션에만 적용된다.

* Java 7 및 이전 버전의 경우 AssertJ 코어 버전 2.xx를 사용해야 한다.

* 최신 버전은 AssertJ 코어 버전 3.23를 제공해주고 있다.

## 지원

* AssertJ는 다음을 위해 유창하고 아름다운 어설션을 쉽게 작성할 수 있도록 하는 **일련의 클래스 및 유틸리티 메서드**를 제공한다.

  * Standard Java
  
  * Java 8
  
  * Guava
  
  * Joda Time
  
  * Neo4J and
  
  * Swing components

---

##  AssertJ 적용

* 여기서부터는 AssertJ를 설정하고 그 가능성을 탐색하는 데 중점을 둘 것이다.

### Assertions 클래스

``` java
import org.assertj.core.api.Assertions;
```

* 이 Assertions 클래스는 AssertJ 사용을 시작하는데 필요한 유일한 클래스이며 필요한 모든 메서드를 제공합니다.

### Assertions 작성

* assertion를 작성하려면 항상 객체를 `Assertions.assertThat()` 메서드에 전달한 다음 실제 어설션을 따라야 한다.

### Object Assertions

``` java
public class Dog { 
    private String name; 
    private Float weight;
    
    // standard getters and setters
}

Dog fido = new Dog("Fido", 5.25);

Dog fidosClone = new Dog("Fido", 5.25);
복사

```

* 다음과 같이 두 object의 동등성을 비교할 수 있는 방법이 있다.

* 내용을 비교하려면,

* `isEqualToComparingFieldByFieldRecursively()`을 사용한다.

``` java
assertThat(fido).isEqualToComparingFieldByFieldRecursively(fidosClone);
```

* 한 object의 각 필드가 다른 개체의 필드와 비교되기 때문에 Fido 와 fidosClone 은 필드별 재귀 필드 비교를 수행할 때 동일하다.

### Boolean Assertions

* 진실 테스트를 위한 간단한 방법이 있다.
  
  * isTrue()
  
  * isFalse()

``` java 
assertThat("".isEmpty()).isTrue();
```


### Iterable/Array Assertions

* Iterable 또는 Array에 주어진 요소가 포함되어 있는 지 확인하는 방법이 있다.

``` java
List<String> list = Arrays.asList("1", "2", "3");

assertThat(list).contains("1");
```

* List가 비어있지 않은 경우

``` java
assertThat(list).isNotEmpty();
```

* List가 주어진 문자로 시작하는 경우(ex. "1"로 시작)

``` java
assertThat(list).startsWith("1");
```

* 동일한 object에 둘 이상의 assertion을 만드는 경우
  
  * 제공된 List가 비어 있지 않고
  
  * "1" 요소를 포함하고
  
  * null을 포함하지 않고
  
  * 요소 "2", "3"의 시퀀스를 포함하는지 확인하는 assertion

``` java
assertThat(list)
  .isNotEmpty()
  .contains("1")
  .doesNotContainNull()
  .containsSequence("2", "3");
```

### Character Assertions

* 문자 유형에 대한 assertion은 대부분 `비교`와 심지어 주어진 문자가 유니코드 테이블에서 온 것인지 `확인`하는 작업을 포함한다.
  
  * 다음은 제공된 문자가 'a'가 아닌지,
  
  * 유니코드 테이블에 있는지,
  
  * 'b'보다 크고
  
  * 소문자인지 확인하는 assertion의 예다.

``` java
assertThat(someCharacter)
  .isNotEqualTo('a')
  .inUnicode()
  .isGreaterThanOrEqualTo('b')
  .isLowerCase();
```

* 이 밖에도 다양한 assertion이 존재한다.

---

## Reference

* [AssertJ 소개](https://www.baeldung.com/introduction-to-assertj#2-writing-assertions)

* [모든 예제 및 코드 구현](https://github.com/eugenp/tutorials/tree/master/testing-modules/assertion-libraries)