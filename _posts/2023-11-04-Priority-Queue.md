---
layout: post
title:  " 우선순위 큐(Priority Queue) 개념 및 사용법 정리 "
categories: DataStructure
author: devFancy
---
* content
{:toc}

## Prologue

> [우선순위 큐와 관련된 문제: Lv2. 과제 진행하기](https://devfancy.github.io/Programmers-176962/)

해당 문제를 풀면서 우선순위 큐에 대한 개념과 사용법을 다시 한번 짚고 넘어가고자 정리하게 되었다.

## Priority Queue란

* `우선순위 큐`는 **우선순위가 가장 높은 데이터를 가장 먼저 삭제하는 자료구조**이다.

* 우선순위 큐는 데이터를 **우선순위에 따라** 처리하고 싶을 때 사용합니다.

    * ex) 물건 데이터를 자료구조에 넣었다가 가치가 높은 물건부터 꺼내서 확인해야 하는 경우

* 우선순위 큐를 구현하는 방법은 다양하다.

    * (1) 단순히 `리스트(List)`를 이용하여 구현할 수 있다.

    * (2) `힙(Heap)`을 이용하여 구현할 수 있다.

* 데이터의 개수가 N개일 때, 구현 방식에 따라서 시간 복잡도를 비교한 내용은 다음과 같다.

    * 리스트 - 삽입 시간: O(1) | 삭제 시간: O(N)

    * 힙 - 삽입 시간: O(logN) | 삭제 시간: O(logN)

* 단순이 N개의 데이터를 힙에 넣었다가 모두 꺼내는 작업은 정렬과 동일하다. **(힙 정렬)**

    * 이 경우 시간 복잡도는 **O(NlogN)** 이다.

* 정리하면, 우선순위 큐는 배열, 연결리스트, 힙으로 구현이 가능하나 이 중 힙(Heap)으로 구현하는 것이 가장 효율적이다.

* 데이터를 삽입할 때 우선순위를 기준으로 최대 힙 또는 최소 힙을 구성하고

    데이터를 꺼낼 때 루트 노드를 얻어낸 뒤 

    루트 노드를 삭제할 때는 빈 루트 노드 위치에 맨 마지막 노드를 삽입한 후 

    아래로 내려가면서 적절한 자리를 찾아 옮기는 방식으로 진행한다.

* 최대 값이 우선순위인 큐 = 최대힙, 최소 값이 우선순우이인 큐 = 최소 힙

### 힙(Heap) 특징

* `힙`은 완전 이진 트리 자료구조의 일종이다.

* 힙에서는 항상 **루트 노드(root node)를 제거**한다.

* **최소 힙(min heap)**

    * 루트 노드가 가장 작은 값을 가진다.

    * 따라서 값이 작은 데이터가 우선적으로 제거된다.

* **최대 힙(max heap)**

    * 루트 노드가 가장 큰 값을 가진다.
    
    * 따라서 값이 큰 데이터가 우선적으로 제거된다.

### 완전 이진 트리(Complete Binary Tree)

* 완전 이진 트리란 루트 노트부터 시작하여 왼쪽 자식 노드, 오른쪽 자식 노드 순서대로 데이터가 차례대로 삽입되는 트리를 의미한다.

* 원소를 제거할 때는 가장 마지막 노드가 루트 노드의 위치에 오도록 한다.

## Priority Queue 특징

1. 높은 우선순위의 요소를 먼저 꺼내서 처리하는 구조이다. (우선순위 큐에 들어가는 원소는 비교가 가능한 기준이 있어야 한다)

2. 내부 요소는 힙으로 구성되어 `이진 트리` 이루어져 있다.

3. 내부 구조가 힙으로 구성되어 있기에 시간 복잡도는 `O(NlogN)`이다.

4. 우선순위를 중요시해야 하는 상황에서 주로 쓰인다.

## Priority Queue 선언

* `Priority Queue`를 사용하려면 `java.util.PriorityQueue`를 import해야 한다.

```java
import java.util.PriorityQueue;
import java.util.Collections;

public class PriorityQueue() {
    //낮은 숫자가 우선 순위인 int 형 우선순위 큐 선언
    PriorityQueue<Integer> priorityQueueLowest = new PriorityQueue<>();

    //높은 숫자가 우선 순위인 int 형 우선순위 큐 선언
    PriorityQueue<Integer> priorityQueueHighest = new PriorityQueue<>(Collections.reverseOrder());
}
```

## Priority Queue 동작

### Priority Queue 값 추가하기

```java
import java.util.PriorityQueue;

public class PriorityQueueDemo {
	public static void main(String[] args) {		
		PriorityQueue<Integer> pq = new PriorityQueue<>();
		
		// 1, 15, 10, 21, 25, 18, 8 값 추가
		pq.add(1);
        pq.add(15);		
        pq.offer(10);
		pq.add(21);
        pq.add(25);
        pq.offer(18);
		pq.add(8);
		
		System.out.print(pq); // 결과 출력: [1, 15, 8, 21, 25, 18, 10]
	}
}
```

* 우선순위 큐에 값을 추가하는 방법은 `add()`, `offer()` 메서드가 있다.

    * `add(value)` 메서드는 **삽입이 성공하면 true를 반환하고, 큐에 여유 공간이 없어 삽입에 실패하면 IllegalStateException 을 발생**시킨다.

* `add()` 메서드는 Collection 클래스에서 가져오는 메서드라면, `offer()` 메서드는 Queue 클래스에서 가져오는 메서드다.

* 결과를 보면 값을 입력한 순서가 아닌 **우선순위 큐만의 정렬**방식으로 출력된다.

* 결과: 1, 15, 8, 21, 25, 18, 10

추가할 때 우선순위 큐의 동작은 아래와 같은 과정을 통해 정렬이 된다.

![](/assets/img/datastructure/Priority-Queue-1.png)

1. 우선순위 큐에 숫자 8을 추가한다. 숫자 8은 부모와 비교해서 부모보다 작은 값인 경우 스왑한다. -> 10과 8의 위치가 변경된다.

![](/assets/img/datastructure/Priority-Queue-2.png)

2. 8은 다시 부모의 값과 비교한다. 하지만 자식 값이 더 크므로 스왑하지 않는다.

### Priority Queue 값 삭제하기

```java
import java.util.PriorityQueue;

public class PriorityQueueDemo {
	public static void main(String[] args) {		
		PriorityQueue<Integer> pq = new PriorityQueue<>();
		
		// 1, 15, 10, 21, 25, 18, 8 값 추가
		pq.add(1);
        pq.add(15);
        pq.offer(10);
		pq.add(21);
        pq.add(25);
        pq.offer(18);
		pq.add(8);
		
		System.out.println(pq); // 결과 출력: [1, 15, 8, 21, 25, 18, 10]
		
		pq.poll();

		System.out.println(pq); // 결과 출력: [8, 15, 10, 21, 25, 18]

		pq.remove();
		pq.remove(1);

		System.out.println(pq); // 결과 출력: [10, 15, 18, 21, 25]
		
		pq.clear();

		System.out.println(pq); // 결과 출력: []
	}
}
```
* 우선순위 큐에서 값을 삭제하는 방법은 여러가지가 있다.

* `poll()`, `remove()` 메서드를 사용하면 우선순위가 가장 높은 값을 제거한다.

    * `poll()` 메서드는 **첫번째 값을 반환하고 제거한다. 만약 우선순위 큐가 비어있다면 null을 반환**한다.

    * `remove()` 메서드는 첫번째 값을 제거한다.

* `clear()` 메서드를 사용하면 우선순위의 큐의 모든 값을 삭제한다. (=초기화)

* 결과를 보면 **첫 번째 우선순위를 삭제하면 하나씩 밀리는 것이 아니라 우선순위를 재정렬**하는 것을 확인할 수 있다.

삭제할 때, 우선순위 큐의 동작은 아래와 같은 과정을 통해 정렬이 된다.

![](/assets/img/datastructure/Priority-Queue-3.png)

1. 우선순위 가장 높은 루트 노드인 (1)를 반환하고, 마지막 노드인 (10)이 스왑하고 난 뒤에 제거한다.

![](/assets/img/datastructure/Priority-Queue-4.png)

2. (1)을 제거하고 부모 노드 (10), 자식 노드(15, 8)과 비교하여 더 작은 값이 부모 노드로 올라간다.

![](/assets/img/datastructure/Priority-Queue-5.png)

이렇게 다시 우선순위가 정렬된다.

### Priority Queue 값 출력하기

```java
import java.util.Iterator;
import java.util.PriorityQueue;

public class PriorityQueueDemo {
	public static void main(String[] args) {		
		PriorityQueue<Integer> pq = new PriorityQueue<>();
		
		// 1, 15, 8, 21, 25, 18, 10 값 추가
		pq.add(1);		
        pq.add(15);		
        pq.offer(10);
		pq.add(21);		
        pq.add(25);		
        pq.offer(18);
		pq.add(8);
		
		System.out.println(pq.peek()); // 결과 출력: 1
		
		Iterator iterator = pq.iterator();
		while(iterator.hasNext())
			System.out.print(iterator.next() + " "); // 결과 출력: 1 15 8 21 25 18 10
	}
}
```

* Priority Queue에서 `peek()` 메서드를 사용하면 **우선순위가 가장 높은 값이 출력**된다.

* 전체 Queue의 값을 가져오려면 Iterator() 메서드를 사용하여 가져오면 된다.

## Reference

* [자료구조: 우선순위 큐(Priority Queue)와 힙(Heap) 10분 핵심 요약](https://www.youtube.com/watch?v=AjFlp951nz0)

* [[Java] Priority Queue(우선 순위 큐)](https://velog.io/@gillog/Java-Priority-Queue%EC%9A%B0%EC%84%A0-%EC%88%9C%EC%9C%84-%ED%81%90)

* [[JAVA] Priority Queue(우선순위 큐) 개념 및 사용법 정리](https://crazykim2.tistory.com/575)