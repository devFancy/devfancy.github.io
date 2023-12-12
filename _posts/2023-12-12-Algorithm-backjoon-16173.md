---
layout: post
title:  " [백준] 16173. 점프왕 쩰리 (Small) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/16173)

## 성능 요약

* 메모리: 14128 KB, 시간: 124 ms

## 구분

* 너비 우선 탐색, 브루트포스 알고리즘, 깊이 우선 탐색, 그래프 이론, 그래프 탐색, 구현

## Answer Code1

```java
// [백준] 16173. 점프왕 쩰리 (Small) - 23.12.11
import java.util.*;
import java.io.*;

class Jump_king_jelly {
  static final int MAX = 3 + 100 + 10;
  static int map[][];
  static boolean visited[][];
  static int N;
  static int dirY[] = {1, 0};
  static int dirX[] = {0, 1};

  public static void dfs(int y, int x) {
    visited[y][x] = true;

    if(y == N && x == N)
      return;

    for(int i = 0; i < 2; i++) {
      int newY = y + dirY[i] * map[y][x];
      int newX = x + dirX[i] * map[y][x];
      if(visited[newY][newX] == false) {
        dfs(newY, newX);
      }
    }
  }

  public static void main(String[] args) throws IOException {
    // 0. 입력 및 초기화
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

    N = Integer.parseInt(br.readLine());
    map = new int[MAX][MAX];
    visited = new boolean[MAX][MAX];

    // 1. map에 정보 반영
    for(int i = 1; i <= N; i++) {
      StringTokenizer st = new StringTokenizer(br.readLine());
      for(int j = 1; j <= N; j++) {
        map[i][j] = Integer.parseInt(st.nextToken());
      }
    }


    // 2. dfs 수행
    dfs(1,1);

    // 3. 출력
    if(visited[N][N]) bw.write("HaruHaru");
    else bw.write("Hing");

    bw.close();
    br.close();
  }
}
```

## Answer Code2

```java
// [백준] 16173. 점프왕 쩰리 (Small) - 23.12.12
import java.util.*;
import java.io.*;

public class Jump_king_jelly2 {
    static final int MAX = 3 + 110;
    static int[][] map;
    static int[] dirX = {0, 1};
    static int[] dirY = {1, 0};
    static int N;
    public static void dfs(int y, int x) {
        int value = map[y][x];
        map[y][x] = 0;
        if(y == N && x == N) return;

        for(int i = 0; i < 2; i++) {
            int newY = y + dirY[i] * value;
            int newX = x + dirX[i] * value;

            if(value != 0) {
                dfs(newY, newX);
            }
        }

    }
    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        N = Integer.parseInt(br.readLine());
        map = new int[MAX][MAX];

        // 1. map에 정보 반영하기 
        for(int i = 1; i <= N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            for(int j = 1; j <= N; j++) {
                map[i][j] = Integer.parseInt(st.nextToken());
            }
        }

        // 2. dfs 호출
        dfs(1,1);

        // 3. 출력하기
        if(map[N][N] == 0) bw.write("HaruHaru");
        else bw.write("Hing");
        
        bw.close();
        br.close();
    }
}
```

## Review

* 이번 문제에서는 중요한 Key point는 방향과 이동할 수 있는 칸의 수이다.

  * 방향은 오른쪽과 아래쪽 방향만 있으므로, dirX, dirY에 2가지의 값을 넣는 것이고, 이동할 수 있는 칸의 수는 **현재 밟고 있는 칸에 쓰여 있는 수 만큼**이므로 그에 따른 로직을 구현하면 된다.

* 그리고 현재 밟고 있는 칸의 최대 수가 100이므로 `MAX`라는 값에 100을 더하고 여유분으로 10을 더해서 -> 기존 3(N의 최대 수) + 110(밟고 있는 칸의 최대 수 + 여유분)이 된 것이다.

* 두번째 풀이는 visited 배열을 안쓰고 풀이한 방법이다.

  * 다음 칸을 이동할 때마다 해당 위치를 0으로 바꿔주고, 만약 끝까지 도달했을 때 값이 0이라면 "HaruHaru"를 반환하도록 구현했다.


