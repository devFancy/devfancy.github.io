---
layout: post
title: " 32. Implement Queue using Stacks "
categories: LeetCode
author: devFancy
---
* content
{:toc}

## Problem

* https://leetcode.com/problems/implement-queue-using-stacks/description/

* 두 개의 스택을 사용해 큐(FIFO)를 구현하는 문제였다.

    * 스택의 기본 연산만 사용하여 큐를 구현하라는 것이다.

    * 큐에서의 주요 연산인 push(), pop(), peek(), empty()를 구현해야 한다.


---

## Answer

```java
class MyQueue {

    Stack<Integer> s1;
    Stack<Integer> s2;
    
    public MyQueue() {
        s1 = new Stack<>();
        s2 = new Stack<>();
    }
    
    // 큐의 뒤쪽에 요소를 추가하는 연산
    public void push(int x) {
        s1.push(x);
    }
    
    // 큐의 앞쪽 요소를 제거하는 연산
    public int pop() {
        // s2가 비어 있을 때 s1의 모든 요소를 s2로 옮긴 후 pop
        if (s2.isEmpty()) {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
        }
        return s2.pop();
    }
    
    // 큐의 앞쪽 요소를 확인하는 연산
    public int peek() {
        // s2가 비어 있을 때 s1의 모든 요소를 s2로 옮긴 후 peek
        if (s2.isEmpty()) {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
        }
        return s2.peek();
    }
    
    // 큐가 비어 있는지 확인하는 연산
    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();   
    }
}
```

## Solution

* 스택은 LIFO 방식이지만, 큐는 FIFO 방식을 요구합니다. 이를 해결하기 위해 두 개의 스택을 사용할 수 있다.

    * **스택1(s1)**: 새로운 요소를 추가하는 스택.

    * **스택2(s2)**: 요소를 제거하거나 앞쪽을 확인할 때 사용하는 스택.

* 이 두 스택을 사용해 큐의 동작을 흉내내면 된다.

    * s1에 새 요소를 계속 추가하고,

    * 요소를 제거하거나 볼 때는 s1에서 s2로 요소를 옮기고, s2의 상단에서 요소를 제거하거나 확인할 수 있다.

    * 이렇게 하면 FIFO 동작을 구현할 수 있다. (그림으로 확인하면 더 이해하기 쉽다 !)

## Review

* 2개의 스택을 이용하여 큐를 구현하는 문제였다.

* 구현에 대한 아이디어가 한 번에 떠오르지 못해서, 힌트를 보고 30분 안으로 구현해서 성공했다. 동작 원리는 알고 있었지만, 막상 구현하기엔 쉽지 않았다. 이 문제는 일주일 내로 다시 풀어보기로 하자 !

* 그리고 머릿속으로 정확히 안떠오르면 아이패드로 그림을 그려가면서 해보자. 그럼 더 쉬울 거다 !