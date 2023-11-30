---
layout: post
title: " 알고리즘 수업 - 깊이 우선 탐색 2(DFS) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/24480)

## 성능 요약

* 메모리: 93168 KB, 시간: 1104 ms

## 구분

* 그래프 이론, 그래프 탐색, 너비 우선 탐색, 깊이 우선 탐색

## Answer Code(2023.11.30)

```java
import java.util.*;
import java.io.*;

public class DFS_2 {
  static final int MAX = 100000 + 10;
  static ArrayList<Integer>[] graph;
  static boolean[] visited;
  static int N, M, R;
  static int[] answer;
  static int order;
  public static void dfs(int idx) {
    visited[idx] = true;
    answer[idx] = order;
    order++;

    for(int i = 0; i < graph[idx].size(); i++) {
      int next = graph[idx].get(i);
      if(visited[next] == false) {
        dfs(next);
      }
    }
  }
  public static void main(String[] args) throws IOException {
    // 0. 입력 및 초기화
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

    StringTokenizer st = new StringTokenizer(br.readLine());
    N = Integer.parseInt(st.nextToken());
    M = Integer.parseInt(st.nextToken());
    R = Integer.parseInt(st.nextToken());

    // 1. graph에 연결 정보 채우기
    graph = new ArrayList[MAX];
    for(int i = 1; i <= N; i++) {
      graph[i] = new ArrayList<>();
    }
    visited = new boolean[MAX];
    answer = new int[MAX];
    order = 1;

    for(int i = 0; i < M; i++) {
      st = new StringTokenizer(br.readLine());
      int u = Integer.parseInt(st.nextToken());
      int v = Integer.parseInt(st.nextToken());
      graph[u].add(v);
      graph[v].add(u);
    }

    // 2. 내림차순 정렬
    for(int i = 1; i <= N; i++) {
      Collections.sort(graph[i], Collections.reverseOrder());
    }

    // 3. dfs 호출하기
    dfs(R);

    // 4. 출력하기
    for(int i = 1; i <= N; i++) {
      bw.write(String.valueOf(answer[i]));
      bw.newLine();
    }
    bw.close();
    br.close();
  }
}

```

## 문제풀이

* 지난번 문제인 [깊이 우선 탐색 - 1](https://devfancy.github.io/Algorithm-Baekjoon-24479/)과 한 가지 다른 점을 제외하고 나머지는 동일하다.

* 내림차순 정렬을 하기 위해서는 sort()의 인자에 추가로 `Collections.reverseOrder()` 를 전달해주면 된다.

![](/assets/img/algorithm/Algorithm-Baekjoon-24480-1.jpeg)