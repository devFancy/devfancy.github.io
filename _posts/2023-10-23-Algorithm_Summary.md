---
layout: post
title: " [Java] 알고리즘/코딩테스트를 위한 코드 정리 "
categories: AlgorithmSkill
author: devFancy
---
* content
{:toc}

## Prologue

* Java로 알고리즘/코딩테스트에서 자주 쓰이는 문법들을 정리하기 위한 포스팅이다.

## 구현

* 구현은 머릿속에 있는 알고리즘을 소스코드로 바꾸는 과정이다.

    * Problem -> Thinking -> Solution

  * 구현 유형의 예시는 다음과 같다.

    * 알고리즘은 간단한데 코드가 지나칠 만큼 길어지는 문제
    
    * 실수 연산을 다루고, 특정 소수점 자리까지 출력해야 하는 문제
    
    * 문자열을 특정한 기준에 따라서 끊어 처리해야 하는 문제
    
    * 적절한 라이브러리를 찾아서 사용해야 하는 문제

* 구현 유형은 `완전 탐색`, `시뮬레이션`을 포함한다.

  - `완전 탐색`(Brute Forcing) : 모든 경우의 수를 주저 없이 다 계산하는 해결 방법
  - `시뮬레이션` : 문제에서 제시한 알고리즘을 한 단계씩 차례대로 직접 수행

> 관련 문제

* [[Programmers] 150370. 개인정보 수집 유효기간](https://devfancy.github.io/Programmers-150370/)

* [[Programmers] 42888. 오픈채팅방](https://devfancy.github.io/Programmers-42888/)

* [[Programmers] 92341. 주차 요금 계산](https://devfancy.github.io/Programmers-92341/)

* [[Programmers] 12981. 영어 끝말잇기](https://devfancy.github.io/Programmers-12981/)

* [[Programmers] 92334. 신고 결과 받기](https://devfancy.github.io/Programmers-92334/)

* [[Programmers] 118666. 성격 유형 검사하기](https://devfancy.github.io/Programmers-118666/)

* [[Programmers] 81301. 숫자 문자열과 영단어](https://devfancy.github.io/Programmers-81301/)

* [[Programmers] 67256. 키패드 누르기](https://devfancy.github.io/Programmers-67256/)

## DFS/BFS

* 깊이 우선 탐색과 너비 우선 탐색은 [기본적인 그래프 기법 : DFS, BFS](https://devfancy.github.io/DataStructure-DFS-BFS/)에 정리했으니, 해당 글을 참고하자.

### 유형1. 연결된 요소 찾기

* 연결된 노드의 개수는 몇 개인가요?

* 연결된 묶음/덩어리의 개수는 몇 개인가요?

* 1번과 연결된 노드의 번호를 오름차순으로 출력하세요

* 1번과 3번의 거리는 얼마인가요?

> 이 유형을 잘 풀기 위해 고민할 것들

* 주요 키워드: 정점(node), 간선(edge), 연결, 네트워크, 그래프

* 주어진 정보를 어떻게 변환할지 -> 2차원 배열(1,000이하) / ArrayList(1,000 초과)

* 재방문을 방지하는 방법

> 관련 문제

* 대표: [[solved.ac] Class3++ 2606. 바이러스](https://devfancy.github.io/solved-class3-backjoon-2606/)

* [[solved.ac] Class3++ 11724. 연결 요소의 개수](https://devfancy.github.io/solved-class3-backjoon-11724/)

* [[백준] 알고리즘 수업 - 깊이 우선 탐색 1](https://devfancy.github.io/Algorithm-Baekjoon-24479/)

* [[백준] 알고리즘 수업 - 깊이 우선 탐색 2](https://devfancy.github.io/Algorithm-Baekjoon-24480/)

* [[solved.ac] Class3++ 1260. DFS와 BFS](https://devfancy.github.io/solved-class3-backjoon-1260/)

* [[백준] 2644번. 촌수계산(DFS)](https://devfancy.github.io/Algorithm-backjoon-2644/)

* [[solved.ac] Class4++ 11725. 트리의 부모찾기](https://devfancy.github.io/Algorithm-backjoon-11725/)

### 유형2. 같은 부류 찾기

* 연결된 묶음/덩어리의 개수는 몇 개인가요?

* 가장 큰 덩어리의 크기는 얼마인가요?

> 이 유형을 잘 풀기 위해 고민할 것들

* 주요 키워드: 인접한 위치로 이동, 상하좌우, 가로/세로, 대각선으로 이동

* 주어진 정보를 어떻게 변환할지

* 재방문을 방지하는 방법

* 어느 지점에서 DFS를 시작할지

* 어느 방향으로 DFS를 진행할지

* [[solved.ac] Class3++ 1012. 유기농 배추](https://devfancy.github.io/solved-class3-backjoon-1012/)

* [[백준] 13565. 침투](https://devfancy.github.io/Algorithm-backjoon-13565/)

* [[백준] 4963. 섬의 개수](https://devfancy.github.io/Algorithm-backjoon-4963/)

* [[백준] 1388. 바닥장식](https://devfancy.github.io/Algorithm-backjoon-1388/)

* [[백준] 16173. 점프왕 쩰리 (Small)](https://devfancy.github.io/Algorithm-backjoon-16173/)

### 그외 

* [[Programmers] 1844. 게임 맵 최단거리(bfs)](https://devfancy.github.io/Programmers-1844/)

* [[Programmers] 43162. 네트워크](https://devfancy.github.io/Programmers-43162/)

* [[Programmers] 159993. 미로 탈출](https://devfancy.github.io/Programmers-159993/)

* [[백준] 1937. 욕심쟁이 판다](https://devfancy.github.io/baekjoon-1937/)

* [[Programmers] 43165. 타켓 넘버(dfs)](https://devfancy.github.io/Programmers-43165/)

## Stack

![](/assets/img/java/stack.png)

* 스택은 `LIFO`(List In First Out, 후입선출) 구조로 데이터를 쌓아올린 형태의 자료구조를 뜻한다. ex) 쓰레기통, 마트용 음료수 진열대, 프링X스(과자)

* 즉 한쪽 끝에서만 자료(데이터)를 넣고 뺄 수 있는 형식의 자료 구조이다.

* 스택은 데이터를 쌓는 형식으로 저장하는데 따라서 조회, 추가, 삭제 모두 **가장 위에 있는, 가장 최근의 값**에서 이루어진다.

* 스택 구조에서 가장 상단에 있는 데이터를 `Top` 라 부른다.

> 관련 문제

* [[Programmers] 131704. 택배 상자]({{site.url}}/Programmers-131704/)

### Stack 선언

```java
Stack<Element> stack = new Stack<>();
```

### Stack 주요 클래스

```java
public Element push(Element item); // 데이터 추가
public Element pop(); // 최근에 추가된(Top) 데이터 삭제
public Element peek(); // 최근에 추가된(Top) 데이터 조회
public boolean empty(); // stack의 값이 비었는지 확인, 비었으면 true, 아니면 false
public int seach(Object o); // 인자값으로 받은 데이터의 위치 반환, 그림으로 설명하겠음
```

### Stack 예제

```java
Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < 5; i++) {
            stack.push(i + 1);
            System.out.println(stack.peek());
        } // 1, 2, 3, 4, 5 가 현재 들어가 있음
        stack.pop(); // 1, 2, 3, 4
        System.out.println(stack.peek()); // 4
        System.out.println(stack.search(1)); // 4
        System.out.println(stack.empty()); // false
```

## Queue

![](/assets/img/java/queue.png)

* 큐는 `FIFO`(First In First Out, 선입선출) 데이터를 순서대로 줄을 세운 형태의 자료구조를 뜻한다. ex) 놀이공원 이나 매표소 등 줄을 서서 차례로 업무를 처리하는 경우

* 주로 `앞(frotn`)에서는 `조회/삭제` 연산을 수행하고, `뒤(Rear)`에서는 `삽입` 연산을 수행한다.

* 그래프의 넓이 우선 탐색(BFS)에서도 사용된다.

* 용어 정리
  
    * `Enqueue` : 큐 맨 뒤에 데이터 추가

    * `Dequeue` : 큐 맨 앞쪽의 데이터 삭제

> 관련 문제

* [[Programmers] 42587. 프린터]({{site.url}}/Programmers-42587/)

### Queue 선언

```java
import java.util.LinkedList; //import
import java.util.Queue; //import
Queue<Integer> queue = new LinkedList<>(); //int형 queue 선언, linkedlist 이용
Queue<String> queue = new LinkedList<>(); //String형 queue 선언, linkedlist 이용
```

* 자바에서 큐는 `LinkedList`를 활용하여 생성해야 한다. 그렇기에 그렇기에 `Queue`와 `LinkedList`가 다 **import되어 있어야 사용이 가능**하다.

* `Queue<Element> queue = new LinkedList<>()`와 같이 선언해주면 된다.

### Queue 값 추가

```java
Queue<Integer> q = new LinkedList<>(); // int형 queue 선언

        q.offer(3);
        q.offer(5);
        q.offer(1);
        q.offer(4);

        System.out.println(q); // 출력 결과 : [3, 5, 1, 4]
```

* Queue에 값을 추가하려면 `offer(value)` 메서드를 사용한다.

* 이때, add(value) 메서드를 사용해서도 값을 추가할 수 있다. 

* 큐 용량 초과 등의 이유로 값 추가에 실패했을 때, add() 메서드는 예외를 발생시키고 offer() 메서드는 false를 리턴한다는 차이가 있다.


### Queue 값 삭제

```java
Queue<Integer> queue = new LinkedList<>(); //int형 queue 선언
queue.offer(1);     // queue에 값 1 추가
queue.offer(2);     // queue에 값 2 추가
queue.offer(3);     // queue에 값 3 추가
queue.poll();       // queue에 첫번째 값을 반환하고 제거 비어있다면 null
queue.remove();     // queue에 첫번째 값 제거
queue.clear();      // queue 초기화
```

* Queue에서 값을 삭제하려면 `poll()` 메서드를 사용한다. 물론 `remove`를 사용해도 된다.

* Queue의 모든 데이터를 삭제하려면 `clear()` 메서드를 사용한다.

### Queue에서 가장 먼저 들어간 값 출력

```java
Queue<Integer> queue = new LinkedList<>(); //int형 queue 선언
queue.offer(1);     // queue에 값 1 추가
queue.offer(2);     // queue에 값 2 추가
queue.offer(3);     // queue에 값 3 추가
queue.peek();       // queue의 첫번째 값 참조
```

* Queue에서 첫번째로 저장된 값을 참조하고 싶다면 `peek()`라는 메서드를 사용한다.

### 그 외 Queue 주요 메서드

* `isEmpty(), isFull()` : 각각 큐가 비었는지, 가득 찼는지를 boolean 형태로 반환한다.

* `enqueue()` : 큐에 새로운 원소를 삽입한다. 만약 가득 차 있다면 예외를 던진다.

* `peek()` : 맨 앞에 위치한 데이터를 읽어온다.

* `dequeue()` : 맨 앞에 위치한 데이터를 읽어오고, 해당 데이터를 큐(queue)에서 제거한다.

## Map

* 맵(Map)은 key와 value로 이루어져 있고, 두개의 값이 한 쌍을 이루어 데이터를 저장하는 자료구조이다.

* 순서가 없으며, 중복을 허용하지 않는 특징이 있다.

> 관련 문제

- [[Programmers] 150370. 개인정보 수집 유효기간]({{site.url}}/Programmers-150370/)

### Map 선언

```java
//map 선언
        Map<String, String> map = new HashMap<String, String>();
 
        //map에 값 저장
        map.put("이름", "팬시");
        map.put("취미", "운동");
 
        //map의 크기 출력
        System.out.println(map.size());
        
        //map의 모든 값 출력
        System.out.println(map.toString());
        
        //map의 key가 이름인 값 출력
        System.out.println(map.get("이름"));
```

## 문자열

### String.toCharArray()

* `String.toCharArray()`은 문자열을 한 글자씩 쪼개서 이를 char타입의 배열에 집어넣어주는 메소드이다.

* String(문자열)을 char형 배열로 바꾼다.

```java
class Solution {
    static boolean v[][]; // 체크 배열
    
    public int solution(int m, int n, String[] board) {
        int answer = 0;
        
        char copy [][] = new char[m][n];
        
        // 보드를 2차원 문자 배열로 복사합니다.
        for(int i = 0; i < m; i++) {
            copy[i] = board[i].toCharArray();
        }
		}
}
```

* 예를 들어, 입력으로 주어진 board 배열이 다음과 같다고 가정하면,

```java
String[] board = ["CCBDE", "AAADE", "AAABF", "CCBBF"]
```

* 이때, 위에서 제시한 코드를 통해 copy 배열에는 아래와 같이 데이터가 저장된다.

```java
char[][] copy = {
    {'C', 'C', 'B', 'D', 'E'},
    {'A', 'A', 'A', 'D', 'E'},
    {'A', 'A', 'A', 'B', 'F'},
    {'C', 'C', 'B', 'B', 'F'}
};
```

* 결과적으로 copy 배열은 board 배열의 복사본으로, copy 배열을 변경하여 작업하면 원본 board 배열에는 영향을 미치지 않는다.

> 관련 문제

* [[Programmers] [1차] 프렌즈4블록(2018 카카오 블라인드)](https://devfancy.github.io/Programmers-17679/)

### String.contains

* contains() 함수는 대상 문자열에 특정 문자열이 포함되어 있는지 확인하는 함수이다.

    * 대/소문자를 구분한다.

    * 공백을 확인한다.

```java
public class ContainsTest{
    public static void main(String[] args){

        String str = "my java test";

        System.out.println( str.contains("java") );  // true
        System.out.println( str.contains(" my") );  // false -> 공백이 있기 때문
        System.out.println( str.contains("JAVA") );  // false
        System.out.println( str.contains("java test") );  // true

    }

}
```



## Reference

* [이것이 코딩 테스트다](https://product.kyobobook.co.kr/detail/S000001810273)

* [2023-CS-Study: 신입 개발자 면접 대비 CS 스터디](https://github.com/devSquad-study/2023-CS-Study)

* [자바 Queue 클래스 사용법 & 예제 총정리](https://coding-factory.tistory.com/602)