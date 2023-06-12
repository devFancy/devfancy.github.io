---
layout: post
title: " 컬렉션 프레임워크 - List "
categories: Java
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

![](/assets/img/java/java-collection-2.png)

* 이 글은 컬렉션의 모든 기능들 중에 **List** 에 대해서만 정리하고자 한다. (Set, Map은 나중에 다른 post로 업로드할 예정이다)

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

### List<E>의 주요 메서드

* List<E>에는 데이터 추가, 변경, 삭제, 리스트 데이터 정보 추출 및 리스트의 배열 반환 등의 추상 메서드가 정의되어 있다.

* 이 중 주요한 메서드는 다음과 같다.

![](/assets/img/java/java-collection-method-1.png)

![](/assets/img/java/java-collection-method-2.png)

* List<E>에 있는 메서드는 추상 메서드이므로 List<E>의 자식 클래스들은 반드시 이 메서드들을 구현해야 한다.

* 즉, List<E>의 대표적 구현 클래스인 ArrayList<E>, Vector<E>, LinkedList<E>의  내부에는 앞에서 알아본 메서드들이 구현된 상태로 있다는 말이다.

* 그럼 이제 각각 구현 클래스를 이용해 List<E>의 메서드를 활용해 보자.

### ArrayList<E> 구현 클래스

* ArrayList<E>는 대표적인 List<E>의 구현 클래스로, List<E>가 지니고 있는 대표적인 특징인 데이터를 인덱스로 관리하는 기능, 저장 공간을 동적으로 관리하는 기능 등을 그대로 지니고 있다.

ArrayList<E>의 특징

* List<E> 인터페이스를 구현한 구현 클래스

* 배열처럼 수집(collect)한 원소(element)를 인덱스(index)로 관리하며 저장 용량(capacity)을 동적 관리 

#### 데이터 추가하기 - add()

단일 데이터 추가

```java
List<Integer> aList1 = new ArrayList<Integer>();
// add(E element)
aList1.add(3);
aList1.add(4);
aList1.add(5);
System.out.println(aList1.toString) // [3, 4, 5]

// add(int index, E element)
aList.add(1, 6)
System.out.println(aList1.toString()); [3, 6, 4, 5]
```

* 두 번째 데이터 추가 방법으로 1번째 인덱스에 데이터 10을 삽입했을 때, 1번 인덱스에 10이 들어가고, 기존 값들은 1개씩 뒤로 밀려나게 된다.

컬렉션 객체 추가

```java
// addAll(Collection<? extend E> c)
List<Integer> aList2 = new ArrayList<Integer>();
aList2.add(1)
aList2.add(2)
aList2.addAll(aList1);  // aList 1 = [3, 6, 4, 5]
System.out.println(aList2.toString());  // [1, 2, 3, 6, 4, 5]

// addAll(int index, Collection<? extends E> c)
List<Integer> aList3 = new ArrayList<Integer>();
aList3.add(1);
aList3.add(2);
aList3.addAll(1, aList3);
System.out.println(aList3.toString());  // [1, 1, 2, 2]
```

* [1] 앞에서 생성한 aList1 객체를 통째로 추가하면, 추가된 리스트 객체의 전체 데이터가 뒤쪽에 한꺼번에 추가된다.

* [2] 특정 위치에 리스트 객체를 통째로 추가할 수 있다.

#### 데이터 변경하기 - set()

데이터의 변경

```java
// set(int index, e element): aList3 = [1, 1, 2, 2]
aList3.set(1, 5);
aList3.set(3, 6);
System.out.println(aList3.toString());  // [1, 5, 2, 6]
```

* set() 메서드를 이용해 인덱스 1번째에는 5, 3번째에는 6을 넣었으므로 리스트 값이 [1, 5, 2, 6]을 갖게 된다.

* set() 메서드에서는 **기존에 있는 데이터만** 변경할 수 있다.

#### 데이터 삭제하기 - remove(), clear()

데이터 삭제

```java
// remove(int index): aList3 = [1, 5, 2, 6]
aList3.remove(1);
System.out.println(aList3.toString());  // [1, 2, 6]
        
// remove(Object o)
aList3.remove(new Integer(2));
System.out.println(aList3.toString()); // [1, 6]
        
// clear()
aList3.clear();
System.out.println(aList3.toString()); // []
```

* remove(1) : 1번 인덱스에 위치한 값을 삭제하는 의미이다.

* remove(new Integer(2)) : 정숫값 2를 원소로 갖는 객체가 지워진다는 의미이다.

* clear() : 데이터의 개수에 관계없이 모드 ㄴ데이터를 한 번에 삭제하는 의미이다.

#### 데이터 정보 추출하기 - isEmpty(), size(), get(int index)

데이터 정보 추출

```java
// isEmpty(), aList3 = []
System.out.println(aList3.isEmpty()); // true

// size()
aList3.add(1);
aList3.add(2);
aList3.add(3);
System.out.println(aList3.toString());  // [1, 2, 3]
System.out.println("size: " + aList3.size());   // size: 3

// get(int index)
System.out.println("0번째: " + aList3.get(0)); // 0번째: 1
System.out.println("1번째: " + aList3.get(1)); // 1번째: 2
System.out.println("2번째: " + aList3.get(2)); // 2번째: 3
for(int i = 0; i < aList3.size(); i++) {
    System.out.println(i + "번째: " + aList3.get(i));
}
```

#### 배열로 반환하기 - toArray(), toArray(T[] t)

리스트 -> 배열

```java
// toArray() aList3 = [1, 2, 3]
Object [] object = aList3.toArray();
System.out.println(Arrays.toString(Object));    // [1, 2, 3]
// toArray(T[] t)
Integer[] integer1 = aList3.toArray(new Integer[0]);
System.out.println(Arrays.toString(integer1));  // [1, 2, 3]
// toArray(T[] t)
Integer[] integer1 = aList3.toArray(new Integer[0]);
System.out.println(Arrays.toString(integer1));  //  [1, 2, 3, null, null]
```

* [1] toArray() 메서드를 Obejct[]에 담아 리턴하면 저장 원소 타입으로 다운캐스팅해 사용해야 할 수 있다.

    * 따라서 **특정 타입의 배열로 바로 변환**하기 위해서는 `toArray(T[] t)` 메서드를 이용하면 된다.

* [2] toArray(T[] t) 메서드를 이용할 때 주의할 점

    * 리스트가 갖고 있는 개수보다 작은 크기의 배열을 넘겨주면 **리스트 데이터의 개수만큼 크기가 확장된 배열을 리턴**한다.

    * 하지만 리스트의 데이터의 개수보다 더 큰 배열을 입력하면 **나머지 값은 null**로 리턴하게 된다.

### LinkedList<E> 구현 클래스

#### ArrayList<E>와의 공통점

`ListkedList<E>`는 ArrayList<E>와 몇 가지 공통점을 지니고 있다.

* 동일한 타입의 객체 수집(collection)

* 메모리의 동적할당

* 데이터의 추가, 변경, 삭제등의 메서드

#### ArrayList<E>와의 다른점

`ListkedList<E>`는 ArrayList<E>와는 다르게 몇 가지 차이점을 지니고 있다.

[1] LinkedList<E>는 **저장 용량(capacity)을 매개변수로 갖는 생성자가 없기 때문에 객체를 생성할 때 저장 용량을 지정할 수 없다.**

```java
List<E> aLinkedlist1 = new LinkedList<Integer>(); // O
List<E> aLinkedList2 = new LinkedList<Integer>(20); // X
```

[2] 가장 큰 차이점은 **내부적으로 데이터를 저장하는 방식이 서로 다르다.** ArrayList<E>가 모든 데이터를 위치 정보(인덱스)와 같은 값으로 저장하는 반면, LinkedList<E>는 **앞뒤 객체의 정보를 저장한다.**

말 그대로 **모든 데이터가 서로 연결된 형태로 관리**되는 것이다.

![](/assets/img/java/java-collection-linkedlist.jpg)


## Reference

* [Do it! 자바 완전 정복](https://product.kyobobook.co.kr/detail/S000001818032)

* [컬렉션 프레임워크](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/doc-files/coll-overview.html)