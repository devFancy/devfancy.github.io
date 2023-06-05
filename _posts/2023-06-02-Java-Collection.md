---
layout: post
title: " [Java] 컬렉션 프레임워크 - List, Set, Map "
categories: VueJs
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [Do it! 자바 완전 정복](https://product.kyobobook.co.kr/detail/S000001818032) 책에서 공부하고 정리한 내용을 토대로 작성하였습니다.

## 컬렉션이란?

* `컬렉션`(collection)은 동일한 타입을 묶어 관리하는 자료구조를 말한다.

* 컬렉션의 가장 큰 특징은 데이터의 저장 용량을 **동적**으로 관리할 수 있다. 컬렉션의 저장 공간은 데이터의 개수에 따라 얼마든지 동적으로 변화할 수 있다.

### 컬렉션 프레임워크란?

* 일반적으로 단순히 연관된 클래스와 인터페이스들의 묶음을 `라이브러리`라고 한다.

* 반면 `프레임워크`는 클래스 또는 인터페이스를 생성하는 과정에서 설계의 원칙 또는 구조에 따라 **클래스 또는 인터페이스를 설계하고, 이렇게 설계된 클래스와 인터페이스를 묶어 놓은 개념**이다.

* **`컬렉션 프레임워크`** 는 컬렉션과 프레임워크가 조합된 개념으로, `리스트`, `스택`, `큐`, `트리` 등의 자료구조에 정렬, 탐색 등의 **알고리즘을 구조화**해 놓은 프레임워크다.

* 자바에서 제공하는 컬렉션 프레임워크의 주요 클래스와 인터페이스는 다음과 같다.

![](/assets/img/java/java-collection-1.png)

* 컬렉션의 특성에 따라 구분하면 크게 List<E>, Set<E>, Map<K, V>로 나눌 수 있고, 

    **메모리 입출력 특성**에 따라 기존의 컬렉션 기능을 확장 또는 조합한 Stack<E>, Queue<E>가 있다.

* 이 글은 컬렉션의 모든 기능들 중에 아래 그림과 같이 **List, Set, Map**에 대해서만 정리하고자 한다.

![](/assets/img/java/java-collection-2.png)

## List

* 배열과 리스트의 가장 큰 차이점으 **저장 크기가 고정적인지, 동적으로 변화하는 지의 여부**이다.

* 배열은 저장 크기가 고정적이고, 리스트는 저장 크기가 동적으로 변화된다.

### List<E> 인터페이스 구현 클래스 생성자로 동적 컬렉션 객체 생성

* List<E>는 기본 생성자를 사용해 객체를 생성하면 기본적으로 10만큼의 저장 용량을 내부에 확보해 놓는다.

* 이후 데이터가 추가돼 저장 용량이 더 필요하면 자바 가상 머신이 저장 용량을 **자동**으로 늘리므로 개발자가 따로 신경쓰지 않아도 된다.

```java
// 예시
List<Integer> aList1 = new ArrayList<Integer>(); // capacity = 10;
List<Integer> aList2 = new ArrayList<Integer>(30); // capacity = 30;
Vector<String> aList3 = new Vector<String>(); // capacity = 10;
List<MyWork> aList4 = new ArrayList<MyWork>(20); // 오류
```

* ListedList는 capacity 지정이 불가하다.


### Arrays.asList() 메서드를 이용해 정적 컬렉션 객체 생성

* List<E> 객체를 생성하는 또 다른 방법은 Arrays 클래스의 asList() 정적 메서드를 사용하는 것이다.

* 내부적으로 배열을 먼저 생성하고, 이를 List<E>로 포장만 해놓은 것으로, 내부 구조는 배열과 동일하다.

* 따라서 컬렉션 객체인데도 저장 공간의 크기를 변경할 수 없다.

Arrays.asList() 메서드로 정적 컬렉션 객체 생성

```java
List<제네릭 타입 지정> 참조 변수 = Arrays.asList(제네릭 타입 저장 데이터);
```

```java
// 예시
List<Integer> aList1 = Arrays.asList(1, 2, 3, 4);
aList1.set(1, 7); // [1 7 3 4]
aList1.add(5); // 오류(UnsupportedOperationException)
aList1.remove(0); // 오류(UnsupportedOperationException)
```

* 구현 클래스로 객체를 생성했을 때와 달리 **데이터의 추가(add()) 및 삭제(remove())가 불가능**하다.

* 다만, 저장 공간의 크기를 변경하지 않는 데이터의 변경(set())은 가능하다. 

* 따라서 고정된 개수의 데이터를 저장하거나 활용할 때 주로 사용한다.

## Set

## Map


## Reference

* [컬렉션 프레임워크](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/doc-files/coll-overview.html)