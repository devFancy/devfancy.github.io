---
layout: post
title: " ArrayList<E>와 LinkedList<E>의 성능 비교 "
categories: Java
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [Do it! 자바 완전 정복](https://product.kyobobook.co.kr/detail/S000001818032) 책에서 공부하고 정리한 내용을 토대로 작성하였습니다.

## ArrayList<E>와 LinkedList<E>의 성능 비교

LinkedList<E>와 같은 저장 구조를 지니게 되면 얻을 수 있는 이점이 무엇일까?

![](/assets/img/java/java-arrayList-linkedList-1.jpg)

`가정1`:  7개의 데이터를 가진 `ArrayList<E>` 객체에서 2번 인덱스에 데이터를 추가하고자 한다. 

이 때 기존 2번 이후의 모든 데이터는 한 칸씩 뒤로 밀려나게 되는데, 이는 **밀려나는 모든 데이터의 위치 정보를 수정해야 한다**는 것을 의미한다.

만일 데이터가 1,000개이고 0번 인덱스에 데이터를 추가하면, 1,000개의 데이터 위치 정보를 모두 수정해야 한다는 것이다.

반면 `LikedList<E>`는 **각 원소의 앞뒤 객체 정보만을 저장**하고 있으므로 어딘가에 값이 추가되면 값이 추가된 위치의 앞뒤 데이터 정보만 수정하면 된다.

따라서 중간에 데이터를 추가할 때 **속도 차이**가 날 것이라는 점을 예상할 수 있다.

`가정2`: 특정 인덱스 위치의 값을 가져오려고 한다. 

이런 경우 `LinkedList<E>`에서는 **각 원소가 자신의 인덱스 정보를 따로 갖고 있지 않다.** 

* 특정 인덱스 위치의 값을 가져오기 위해서는 앞에서부터 차례대로 번호를 세어가면서 인덱스의 위치를 찾아야 한다.

반면 `ArrayList<E>`는 **데이터 자체가 인덱스 번호를 갖고 있으므로** 특정 인덱스의 위치를 빠르게 찾을 수 있다.

정리하자면, **데이터의 추가 또는 삭제**를 하는 경우는 `LinkedList<E>`의 속도가 빠르며, **데이터를 검색**하는 경우에는 `ArrayList<E>`의 속도가 빠를 것이다.

![](/assets/img/java/java-arrayList-linkedList-2.png)

## 실습 - 성능 비교(데이터 추가/검색/삭제)

데이터의 추가, 검색, 삭제를 통해 비교해보면 둘의 차이점을 알 수 있다.

```java
package sec01_list.EX06_ArrayListVsLinkedList;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class ArrayListVsLinkedList {
    public static void main(String[] args) {

        //#1. 데이터 추가시간 비교
        List<Integer> aList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        long startTime=0, endTime=0;

        //@1-1 ArrayList 데이터 추가시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            aList.add(0, i);
        }
        endTime = System.nanoTime();
        System.out.println("ArrayList 데이터 추가시간 = " +(endTime-startTime) + " ns");

        //@1-2 LinkedList 데이터 추가시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            linkedList.add(0, i);
        }
        endTime = System.nanoTime();
        System.out.println("LinkedList 데이터 추가시간 = " +(endTime-startTime) + " ns");


        //@2-1 ArrayList 데이터 검색시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            aList.get(i);
        }
        endTime = System.nanoTime();
        System.out.println("ArrayList 데이터 검색시간 = " +(endTime-startTime) + " ns");

        //@2-2 LinkedList 데이터 검색시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            linkedList.get(i);
        }
        endTime = System.nanoTime();
        System.out.println("LinkedList 데이터 검색시간 = " +(endTime-startTime) + " ns");


        //@3-1 ArrayList 데이터 제거시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            aList.remove(0);
        }
        endTime = System.nanoTime();
        System.out.println("ArrayList 데이터 제거시간 = " +(endTime-startTime) + " ns");

        //@3-2 LinkedList 데이터 제거시간
        startTime = System.nanoTime();
        for(int i=0; i<100000; i++) {
            linkedList.remove(0);
        }
        endTime = System.nanoTime();
        System.out.println("LinkedList 데이터 제거시간 = " +(endTime-startTime) + " ns");
    }
}
```

실행 결과

```
ArrayList 데이터 추가 시간 = 994549700 ns
LinkedList 데이터 추가 시간 = 4181500 ns
ArrayList 데이터 검색 시간 = 1316200 ns
LinkedList 데이터 검색 시간 = 4029315900 ns
ArrayList 데이터 삭제 시간 = 842283900 ns
LinkedList 데이터 삭제 시간 = 3683000 ns
```

* 데이터의 추가의 경우 LinkedList<E>는 ArrayList<E>와 비교해 약 237배 빠른 것으로 나왔다.
* 데이터의 검색의 경우 ArrayList<E>가 무려 3,061배 정도 빠른것으로 나왔다.
* 데이터의 삭제의 경우 LinkedList<E>가 약 218배 빠른 것으로 나왔다.

* 정리하자면, **중간 위치에 데이터를 추가 또는 삭제**는 `LinkedList<E>`, 데이터를 **검색**할 일이 많을 때는 `ArrayList<E>`를 사용하는 것이 효율적이다.

## Reference

* [Do it! 자바 완전 정복](https://product.kyobobook.co.kr/detail/S000001818032)