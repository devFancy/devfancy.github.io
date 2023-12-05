---
layout: post
title:  " [백준] 1388. 바닥장식 "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/1388)

## 성능 요약

* 메모리: 14196 KB, 시간: 128 ms

## 구분

* 깊이 우선 탐색, 그래프 이론, 그래프 탐색, 구현

## Answer Code1

```java
import java.util.*;
import java.io.*;

class FloorDecoration {
  static final int MAX = 50 + 10;
  static char[][] map;
  static boolean[][] visited;

  public static void dfs(int y, int x) {
    visited[y][x] = true;

    if(map[y][x] == '-' && map[y][x+1] == '-') {
      dfs(y, x+1);
    }
    if(map[y][x] == '|' && map[y+1][x] == '|') {
      dfs(y+1, x);
    }

  }
  public static void main(String[] args) throws IOException  {
    // 0. 입력 및 초기화
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

    StringTokenizer st = new StringTokenizer(br.readLine());
    int N = Integer.parseInt(st.nextToken());
    int M = Integer.parseInt(st.nextToken());

    map = new char[MAX][MAX];
    visited = new boolean[MAX][MAX];


    // 1. map에 정보 반영
    for(int i = 1; i <= N; i++) {
      String str = br.readLine();
      for(int j = 1; j <= M; j++) {
        map[i][j] = str.charAt(j-1); // String은 0부터 M-1번까지 존재하므로 j-1
      }
    }
    int answer = 0;
    for(int i = 1; i <= N; i++) {
      for(int j = 1; j <= M; j++) {
        if(visited[i][j] == false) {
          dfs(i, j);
          answer++;
        }
      }
    }

    // 2. dfs 수행
    bw.write(String.valueOf(answer));

    // 3. 출력
    bw.close();
    br.close();
  }
}
```

## Answer Code 2

> visited 없이 구현한 결과

```java
import java.util.*;
import java.io.*;

class FloorDecoration {
    static final int MAX = 50 + 10;
    static char[][] map;

    public static void dfs(int y, int x) {
        char cur = map[y][x];
        map[y][x] = 0;

        if(cur == '-' && map[y][x+1] == '-') {
            dfs(y, x+1);
        }
        if(cur == '|' && map[y+1][x] == '|') {
            dfs(y+1, x);
        }

    }
    public static void main(String[] args) throws IOException  {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        map = new char[MAX][MAX];


        // 1. map에 정보 반영
        for(int i = 1; i <= N; i++) {
            String str = br.readLine();
            for(int j = 1; j <= M; j++) {
                map[i][j] = str.charAt(j-1); // String은 0 ~ M-1번까지 존재하므로 j-1
            }
        }
        int answer = 0;
        for(int i = 1; i <= N; i++) {
            for(int j = 1; j <= M; j++) {
                if(map[i][j] != 0) { // 0이 있다면, 이미 방문했다는 의미
                    dfs(i, j);
                    answer++;
                }
            }
        }

        // 2. dfs 수행
        bw.write(String.valueOf(answer));

        // 3. 출력
        bw.close();
        br.close();
    }
}
```

### 정리

> 이 문제는 아래의 기준을 가지고 풀어보는 연습을 해봤다.

1. '-'가 인접해 있고 같은행에 있다면 ? -> DFS / BFS

2. 서로 연결되었다는 정보를 어떻게 하나의 자료구조로 통합할까? -> 2차원 배열 (map)

3. 이미 방문한 지점을 다시 방문하지 않으려면 어떤 자료구조를 사용해야 할까? -> 2차원 배열 (visited)

4. visited 배열을 생략할 수는 없을까? -> visited 없익 구현

5. 어느 지점에서 dfs를 시작할까? -> map에 존재하는 모든 위치

6. 어느 방향에서 dfs를 진행할까? -> 오른쪽 / 아래쪽


## Review

* 이번 문제에는 `char형`을 이용하여 가로만 혹은 세로만 확인해도 답을 얻을 수 있는 문제였다.

* 같은 부류 찾기 유형에서 다른 문제들에 비해 조금은 다른 방법으로 접근하는 문제라서, 여러번 복습을 하면서 내것으로 만들도록 노력하자.

* 이번 문제가 헷갈리다면, 이전 문제인 [유기농 배추](https://devfancy.github.io/solved-class3-backjoon-1012/), [섬의 개수](https://devfancy.github.io/Algorithm-backjoon-4963/)를 참고하자.


