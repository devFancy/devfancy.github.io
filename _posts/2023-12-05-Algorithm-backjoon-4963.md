---
layout: post
title:  " [백준] 4963. 섬의 개수 "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/4963)

## 성능 요약

* 메모리: 16012 KB, 시간: 176 ms

## 구분

* 그래프 이론, 그래프 탐색, 트리, 너비 우선 탐색, 깊이 우선 탐색

## Answer Code

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.StringTokenizer;

public class Number_of_Islands {
  static final int MAX = 50 + 10;
  static boolean[][] map;
  static boolean[][] visited;
  static int M, N;
  static int[] dirY = {-1, -1, 0, 1, 1, 1, 0, -1}; // 상하좌우, 대각선 포함 - 8개 방향
  static int[] dirX = {0, 1, 1, 1, 0, -1, -1, -1};

  public static void dfs(int y, int x) {
    visited[y][x] = true;
    for(int i = 0; i < 8; i++) {
      int newY = y + dirY[i];
      int newX = x + dirX[i];
      if(map[newY][newX] && visited[newY][newX] == false) {
        dfs(newY, newX);
      }
    }

  }

  public static void main(String[] args) throws IOException {
    // 0. 입력 및 초기화
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));


    while(true) {
      StringTokenizer st = new StringTokenizer(br.readLine());

      M = Integer.parseInt(st.nextToken());
      N = Integer.parseInt(st.nextToken());

      if(N == 0 && M == 0) break;

      map = new boolean[MAX][MAX];
      visited = new boolean[MAX][MAX];

      // 1. map 정보 반영
      for(int i = 1; i <= N; i++) {
        int x;
        st = new StringTokenizer(br.readLine());
        for(int j = 1; j <= M; j++) {
          x = Integer.parseInt(st.nextToken());
          map[i][j] = (x == 1 ? true : false); // 방법1
          // map[i][j] = Integer.parseInt(st.nextToken()) == 1; // 방법2
        }
      }

      // 2. dfs 수행
      int answer = 0;
      for(int i = 1; i <= N; i++) {
        for(int j = 1; j <= M; j++) {
          if(map[i][j] && visited[i][j] == false) {
            dfs(i, j);
            answer++;
          }
        }
      }

      // 3. 출력
      bw.write(String.valueOf(answer));
      bw.newLine();
    }

    bw.close();
    br.close();
  }
}
```

## Review

* 이번 문제는 지난 [유기농 배추](https://devfancy.github.io/solved-class3-backjoon-1012/)와 유사해서, 쉽게 풀 수 있었다.

  조금의 차이점이 있다고 하면, 유기농 배추 문제에서는 상하좌우였고, 이번 문제에서는 **상하좌우 뿐만 아니라 대각선도 포함이여서 8개의 방향에 대해 확인**해줘야한다.

* 이번 문제에서는 입력으로 받는 **각 테스트 케이스에 대해 섬의 개수를 출력**하기 때문에, While문 안에 `map`과 `visited` 2차원 배열을 선언해야 한다.

  그래야 **각 테스트 케이스 별로 초기화 작업**이 이루어지므로, answer 값이 정상적으로 출력된다.


