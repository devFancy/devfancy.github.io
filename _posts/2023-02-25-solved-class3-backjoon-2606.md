---
layout: post
title: " [solved.ac] Class3++ 2606. 바이러스 "
categories: Algorithm
author: fancy96
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/2606)

## 성능 요약

* 메모리: 14240 KB, 시간: 128 ms

## 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 너비 우선 탐색(bfs), 깊이 우선 탐색(dfs)

## Answer Code1(2023.02.25)

```java
//import java.io.*;
//import java.util.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
  static boolean [] checked;
  static int [][] arr;
  static int node, line;

  static int count = 0;

  public static void main(String[] args) throws IOException {

    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    node = Integer.parseInt(br.readLine());
    line = Integer.parseInt(br.readLine());

    arr = new int[node+1][node+1];
    checked = new boolean[node+1];

    for(int i = 0; i < line; i++) {
      StringTokenizer str = new StringTokenizer(br.readLine());

      int a = Integer.parseInt(str.nextToken());
      int b = Integer.parseInt(str.nextToken());

      arr[a][b] = arr[b][a] = 1;
    }
    dfs(1);

    System.out.println(count-1);
  }
  public static void dfs(int start) {
    checked[start] = true;
    count++;

    for(int i = 0; i <= node; i++) {
      if(arr[start][i] == 1 && !checked[i]) {
        dfs(i);
      }
    }
  }
}
```

## 문제 풀이 - Answer Code1

* **알고리즘 흐름도** : 입력 받기 -> 인접 행렬에 값 넣어주기 -> DFS 실행하기 -> 출력하기

### Step1

* 입력 받기 및 인접 행렬 값 넣어주기

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;
public class Main {
  static boolean [] checked;
  static int [][] arr;
  static int node, line;

  static int count = 0;

  public static void main(String[] args) throws IOException {

    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    node = Integer.parseInt(br.readLine());
    line = Integer.parseInt(br.readLine());

    arr = new int[node + 1][node + 1];
    checked = new boolean[node + 1];

    for (int i = 0; i < line; i++) {
      StringTokenizer str = new StringTokenizer(br.readLine());

      int a = Integer.parseInt(str.nextToken());
      int b = Integer.parseInt(str.nextToken());

      arr[a][b] = arr[b][a] = 1;
    }
  }
}
```

* import문 - 입출력과 관련된 4개의 메서드를 해도 되고 또는 `import java.io.*`으로 대체해도 된다.

* node : 처음 노드 개수 

* line : 간선 개수(노드끼리 연결된 선 개수)

* arr [][] : 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수(인접 행렬을 표현하기 위한 배열)

* checked [] : 이미 바이러스에 감염되었는지 판단하는 배열의 역할을 수행한다.

* 받은 값은 `arr[a][b] = arr[b][a] = 1`로 한 이유는 1,2 or 2,1나 같은 의미이기 때문이다.

### Step2 

* DFS 구현하기

```java
public class Main {
  public static void dfs(int start) {
    checked[start] = true;
    count++;

    for (int i = 0; i <= node; i++) {
      if (arr[start][i] == 1 && !checked[i]) {
        dfs(i);
      }
    }
  }
}
```

* 처음 값으로 1을 주고, 바이러스에 감염되었으니 count에 +1를 해준다.

* 그런 다음 for문을 돌면서 인접 행렬의 시작 노드와 연결된 값이 1인지 확인하고, checked로 이미 감염된 노드인지 확인한다.

* 둘다 맞다면, DFS를 해당 노드로 다시 실행한다.

* DFS로 노드를 다시 실행할 때 1번 노드와 연결된 다음 노드의 CHECK에 TRUE가 입력되고, 또 count가 +1 추가된다.

* 이런 식으로 DFS가 구현된다.

## Review

* 입출력 부분과 DFS에 대한 감을 지속적으로 익히는 연습을 하자. (아직 부족하다)

* 해당 문제는 2-3번 풀어보면서, 각각의 메서드의 역할을 깊이 이해하도록 노력하자.

## Reference

* [INFODON Blog - [백준알고리즘-JAVA]2606번 풀이(바이러스) - 초보도 이해하는 풀이](https://infodon.tistory.com/97)