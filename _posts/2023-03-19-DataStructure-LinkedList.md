---
layout: post
title: " 연결 리스트 "
categories: DataStructure
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 책을 공부하며 정리한 내용을 토대로 작성하였습니다.

## 연결 리스트

* `연결 리스트`는 동적인 데이터를 처리하는 것과 관련된 수많은 문제의 근간을 이루는 자료구조다.

## 연결 리스트의 종류

* 연결 리스트에는 단일 연결 리스트(singly-linked list), 이중 연결리스트(doubly-linked list), 원형 연결 리스트(circularly-linked list), 이렇게 세 가지 기본 유형이 있다.

* 면접에서는 대부분 **단일 연결 리스트**문제가 나오는 편이다.

### 단일 연결 리스트

![]()

* [그림 5-1]에 나와있는 것처럼 리스트에 들어가는 각 데이터 원소에는 리스트의 다음 원소에 대한 `연결고리(link)`가 들어있다.

* 단일 연결 리스트의 첫 번째 원소는 리스트의 `머리(head)`라고 부른다.

* 단일 연결 리스트의 마지막 원소는 `꼬리(tail)`라고 부르며 연결고리는 비어 있거나 널 연결고리로 이어져 있다.

* 단일 연결 리스트에 있는 연결고리는 다음 노드를 가리키는 포인터나 레퍼런스로만 구성되기 때문에 앞으로만 종주할 수 있다.

* 따라서 리스트를 완전 종주하려면 항상 **첫 번째 원소**부터 시작해야 한다.

* 바꿔 말하자면, 리스트에 있는 모든 원소의 위치를 파악하기 위해서는 **리스트의 첫 번째 원소에 대한 포인터나 레퍼런스가 있어야만 한다.**

* 기본적으로 **C**에서 단일 연결리스트의 형태를 다음과 같이 정의할 수 있다.

```cpp
typedef struct InteElement {
    struct IntElement *next;
    int data;
} IntElement;
```

* **자바**에서 제네릭을 써서 구현하는 방법도 비슷하다. 물론 포인터가 아니라 레퍼런스를 쓴다는 게 달라진다.

```java
// 탬플릿으로 만든 자바용 단일 연결 리스트
public class ListElement<T> {
    public ListElement(T value) { data = value; }
    public ListElement<T> next() { return next; }
    public T value() { return data; }
    public void setNext ( ListElement<T> elem ) { next = elem; }
    public void setValue( T value ) { data = value; }
    private ListElement<T> next;
    private T data;
}
```

### 이중 연결 리스트

![]()

* [그림 5-2]에 나와 있는 이중 연결 리스트는 **단일 연결 리스트의 여러 가지 단점**을 극복하기 위해 만들어졌다.

* `이중 연결 리스트`는 각 원소마다 리스트에서 그다음에 오는 원소에 대한 연결고리 외에 **그 앞에 있는 원소에 대한 연결고리도 들어 있다**는 점에서 단일 연결 리스트와 다르다.

* 이렇게 연결고리를 추가하면 리스트를 어느 방향으로든 종주할 수 있다.

* 어떤 원소에서 시작하든 리스트 전체를 종주하는 것이 가능하다.

* 이중 연결 리스트에도 단일 연결 리스트와 마찬가지로 머리와 꼬리가 있다.

* 리스트의 머리의 이전 원소에 대한 연결고리는 꼬리의 다음 원소에 대한 연결고리와 마찬가지로 비워두거나 널로 지정한다.

* 이중 연결 리스트는 면접 문제로는 그리 많이 나오지 않는다. 단일 연결 리스트를 쓰는 쪽이 더 어렵기 때문이다. 

* 그리고 이중 연결 리스트를 쓰면 불필요하게 복잡해지기만 해서 쓰지 않게 되는 경우도 있다.

### 원형 연결 리스트

* 원형 연결 리스트에는 끝, 즉 머리나 꼬리가 없다.

* 원형 연결 리스트의 모든 원소에서 다음 원소를 가리키는 포인터나 레퍼런스에는 반드시 **널이 아닌 어떤 원소**가 들어가며, 이중 연결 리스트라면 포인터/레퍼런스에도 **널이 아닌 원소**가 들어가야 한다.

* 원소가 하나밖에 없는 리스트라면 그냥 **자기 자신**을 가리키면 된다.

* 원형 연결 리스트의 종주 문제로는 **사이클 회피 문제**가 많이 나온다. 시작점을 제대로 추적하지 않으면 리스트에서 **무한 루프**를 돌 수 있다.

* 원형 연결 리스트도 가끔 쓸 일이 있지만, 면접 문제로는 거의 나오지 않은 편이다.

## 기초적인 연결 리스트 연산

* 연결 리스트 문제를 제대로 풀려면 연결 리스트에 대한 기초적인 연산을 완벽하게 이해해야 한다.

* 기초 연산에는 리스트를 잃어버리지 않기 위한 `머리 원소 추적`, `리스트 종주`, `리스트 원소 추가 및 제거` 등이 있다.

* 여기에서는 단일 연결 리스트로 구현할 때 빠질 수 있는 함정에 초점을 맞춰보도록 한다.

### 머리 원소 추적

* 단일 연결 리스트에는 **반드시 머리 원소를 추적**해야 한다. 그러지 않으면 언어에 따라 가비지 컬렉터에 의해 제거되거나 어딘가에서 길을 잃고 말게 된다.

* 따라서 새로운 원소를 첫 번째 원소 앞에 **추가**한다거나 리스트의 첫 번째 원소를 **제거**할 때 **리스트의 머리에 대한 포인터 또는 레퍼런스를 갱신**해야 한다.

* 함수나 메서드 내에서 리스트를 **변형**시킬 때는 **머리 원소를 제대로 추적**할 수 있도록 주의해야 한다. 함수나 메서드를 호출한 쪽에 바뀐 새로운 머리 원소를 알려줘야 하기 때문이다.

* 예를 들어, 다음과 자바 코드는 리스트의 머리에 대한 레퍼런스를 갱신하기 위해서는 **새로운 머리 원소에 대한 레퍼런스를 반환**해야 한다.

```java
public ListElement<Integer> insertInFront (ListElement<Integer> list, int data) {
ListElement<Integer> l = new ListElement<Integer> (data);
    l.setNext(list);
    return l;
}
```

* 메서드를 호출한 쪽에서는 머리 원소에 대한 레퍼런스를 적당히 갱신해줘야 한다.

```java
int data = ...; // 삽입할 데이터
ListElement<Integer> head = ...; // 머리에 대한 래퍼런스

head = insertInFront(head, data);
```

* 리스트의 맨 앞에 새로운 원소를 추가하는 다음과 같은 `C 코드`를 생각해보자. 제대로 동작하기 위해서는 head 포인터에 대한 포인터를 넘겨줘야 한다.

```cpp
bool insertInFront( IntElement **head, int data) {
    IntElement *newElem = malloc(sizeof(IntElement));
    if( !newElem ) return false;
    
    newElem->data = data;
    newElem->next = *head;
    *head = newElem;
    return true;
}
```

* 이 함수에서는 리턴 값으로 메모리 할당 성패 여부를 돌려주기 때문에 자바에서처럼 새로운 헤드 포인터를 돌려줄 수가 없다. (C에는 예외 기능이 없음)

* C++에서는 머리 포인터에 대한 레퍼런스로 전달할 수도 있고, 새로운 머리 포인터를 리턴할 수도 있다.

### 리스트 종주

* 머리 원소가 아닌 다른 리스트 원소를 가지고 작업을 해야 하는 경우도 있다.

* 연결 리스트의 첫 번째 원소가 아닌 원소에 대한 연산을 하려면 리스트에 있는 원소 중 일부를 종주해야 할 수도 있으며, 이때 **항상 리스트가 끝나지 않는지 확인**을 해야 한다.

* **찾아낼 객체가 리스트에 있는 경우와 마지막 원소를 확인하는 경우**는 다음과 같은 코드로 생각해 볼 수 있다.

```java
public ListElement<Integer> find(ListElement<Integer> head, int data) {
    ListElement<Integer> elem = head;
    while( elem != null && elem.value() != data) {
        elem = elem.next();
    }
    return elem;
}
```

* 함수/메서드를 호출한 쪽에서는 반환 값이 널이 아닌지 확인하여 오류 조건을 ㅏㅈ아야 한다.

### 원소의 삽입과 삭제

* 단일 연결 리스트에 있는 원소들은 다음 원소에 대한 연결고리를 통해서만 관리할 수 있기 때문에 **리스트 중간에서 원소를 삽입 또는 삭제하려면 그 앞 원소의 연결고리를 수정**해야 한다.

* 삭제할 원소(또는 삽입해야할 원소)만 지정된 상황이라면 바로 앞 원소를 찾아낼 만한 다른 방법이 딱히 업기 때문에 **머리에서부터 리스트를 종주**해야만 할 수도 있다.

* 삭제할 원소가 머리 원소라면 한층 더 기울여야 한다.

* 리스트에 있는 한 원소를 삽입 또는 삭제하는 C 함수는 다음과 같이 만들 수 있다.

```cpp
// Insert
void insertNode(listPointer *first, listPointer node)
{   
    listPointer p, q;

    p = q = *first;
    // Empty (비어있는 경우)
    if(!p) {
        *first = node;
        return;
    }
    while(TRUE) {
        p = q;
        q = q->link;
        // Right (맨 끝)
        if(q == NULL) {
            p->link = node;
            return;
        }
    }
}

// Delete
void deleteNode(listPointer *first, int data)
{
    listPointer p, q;
    p = q = *first;
    // Empty (비어있는 경우)
    if(p == NULL) return;
    // Left (맨앞)
    if(p->data <= data) {
        *first = (*first)->link;
        free(p);
        return;
    }
    while(TRUE) {
        // Middle, Right
        if(q->data <= data) {
            p->link = q->link;
            free(q);
            return;
        }
        p = q;
        q = q->link;
        // No data (찾는 값이 없는 경우)
        if(q == NULL) return;
    }
}

```

* 위의 코드를 이해하기 아래와 같이 쉽게 그림으로 그렸다.

* 그림 옆에는 이해하기 쉽도록 슈도 코드(Pseudo-code)로 작성했다. (슈도 코드에는 **모든 경우의 수**를 생각하여 작성함)

> InsertNode [1] 중간 / [2] 맨뒤 / [3] 맨앞 / [4] 비어있는 경우

![](/assets/img/datastructure/linkedList-insertNode-1.png)

![](/assets/img/datastructure/linkedList-insertNode-2.png)

> deleteNode [1] 중간 / [2] 맨뒤 / [3] 맨앞 / [4] 비어있는 경우

![](/assets/img/datastructure/linkedList-deleteNode-1.png)

![](/assets/img/datastructure/linkedList-deleteNode-2.png)

## 연결 리스트 문제

* 자바나 C# 같은 언어에서는 연결 리스트를 직접 구현해서 쓰는 일이 거의 없기 때문에 답안은 모두 C로 구현했다.




##  Reference

* [프로그래밍 면접 이렇게 준비한다](http://www.yes24.com/Product/Goods/75187284)

* [Fundamentals of data structures in C, 2nd edition](https://www.amazon.com/Fundamentals-Data-Structures-Ellis-Horowitz/dp/0929306406)