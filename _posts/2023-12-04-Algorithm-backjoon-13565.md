---
layout: post
title:  " [백준] 13565. 침투 "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/13565)

## 성능 요약

* 메모리: 53320 KB, 시간: 1356 ms
* 메모리: 54268 KB, 시간: 696 ms

## 구분

* 그래프 이론, 그래프 탐색, 트리, 너비 우선 탐색, 깊이 우선 탐색

## Answer Code1(23.12.04)

```java
// 침투 (백준 13565)
import java.util.*;
import java.io.*;

class Penetrate {
  static final int MAX = 1000 + 10;
  static boolean[][] map;
  static boolean[][] visited;
  static int M, N;
  static int dirX[] = {-1, 1, 0, 0};
  static int dirY[] = {0, 0, -1, 1};
  static boolean answer;

  public static void dfs(int y, int x) {
    if(y == N) {
      answer = true;
      return;
    }

    visited[y][x] = true;
    for(int i = 0; i < 4; i++) {
      int newX = x + dirX[i];
      int newY = y + dirY[i];
      if(map[newY][newX] && visited[newY][newX] == false)
        dfs(newY, newX);
    }
  }

  public static void main(String[] args) throws IOException {
    // 0. 입력 및 초기화
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

    StringTokenizer st = new StringTokenizer(br.readLine());
    N = Integer.parseInt(st.nextToken());
    M = Integer.parseInt(st.nextToken());

    // 1. map에 정보 반영하기
    map = new boolean[MAX][MAX];
    visited = new boolean[MAX][MAX];

    for(int i = 1; i <= N; i++) {
      String str = br.readLine();
      for(int j = 1; j <= M; j++)
        map[i][j] = (str.charAt(j - 1) == '0' ? true : false);

    }

    // 2. dfs 수행
    for(int j = 1; j <= M; j++) {
      if(map[1][j]) {
        dfs(1, j);
      }
    }

    // 3. 출력
    if(answer) bw.write("YES");
    else bw.write("NO");

    bw.close();
    br.close();
  }
}
```

### 문제풀이

* 이 문제에서 DFS를 떠올릴 수 있는 키워드는 다음과 같다.

    * 상하좌우로 인접한 흰색 격자들

    * 안쪽까지 침두될 수 있는지 아닌지를 판단

* 문제에서는 전류가 흐르는 것을 '0'으로 해주고, 흐르지 않는 것을 '1'로 나와있는데, 이는 문제를 풀때 헷갈릴 수 있다.

  그래서 전류가 흐르는 것을 '1'로 하고, 흐르지 않는 것을 '0'으로 해주기 위해 바꿔주는 로직을 구성한다.

  이 문제에서 핵심은 **내가 방문하고자 하는 곳을 `1`로 하는 것이 훨씬 더 유리**하다.

* 이 문제에서는 **첫 번째 줄에서 시작해서 마지막에 도달할 수 있는지** 판단하는 것이므로 `dfs(1, j)`라고 해준 것이다.

> [1]. map에 정보 반영하기

* 이중 반복문을 통해 해당 위치에 해당하는 값이 0일 경우, '1'로 바꿔준다.

> [2]. dfs 수행

* 처음 시작 위치가 1부터 시작하기 때문에 `dfs(1, j)`과 같이 표현한 것이고,

* M번 만큼 반복하면서 값이 true일 경우에 한해서만 dfs를 수행하기 때문에 for문 안에 조건문인 `if(map[1][j])`을 추가해준 것이다.

* dfs를 수행할 때, 상하좌우로 확인하므로 반복문 `for(int i = 0; i < 4; i++)`과 방향에 대한 dirX, dirY를 선언해줬다.

  그리고 상하좌우를 확인할 때, **map에 해당하는 값이 true(1)이고, 방문한 적이 없을 경우**에만 dfs를 다시 호출하도록 했다.

* 마지막으로 dfs 메서드 시작할 때, `if(y == N)`을 한 이유는 안쪽까지 도달했는지 확인하기 위해서다.

  만약 **안쪽까지 도달했다면, 즉 N번 줄에 도달했다면 침투를 했다는 의미**이므로 `answer` 값을 true로 바꿔주고 return 해주면 된다.

> [3]. 출력

* 출력할 때는 answer가 true이면 YES를 출력하고, 그게 아니라면 NO를 출력해주면 된다.

> visited 없이 map으로만 구현하기

아래는 visited 없이 map으로도 구현한 코드이다.

```java
import java.util.*;
import java.io.*;

class Penetrate {
    static final int MAX = 1000 + 10;
    static boolean[][] map;
    static int M, N;
    static int dirX[] = {-1, 1, 0, 0};
    static int dirY[] = {0, 0, -1, 1};
    static boolean answer;

    public static void dfs(int y, int x) {
        if(y == N) {
            answer = true;
            return;
        }

        map[y][x] = false;
        for(int i = 0; i < 4; i++) {
            int newX = x + dirX[i];
            int newY = y + dirY[i];
            if(map[newY][newX])
                dfs(newY, newX);
        }
    }

    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        StringTokenizer st = new StringTokenizer(br.readLine());
        N = Integer.parseInt(st.nextToken());
        M = Integer.parseInt(st.nextToken());

        map = new boolean[MAX][MAX];

        // 1. map에 정보 반영하기
        for(int i = 1; i <= N; i++) {
            String str = br.readLine();
            for(int j = 1; j <= M; j++) {
                map[i][j] = (str.charAt(j - 1) == '0' ? true : false);
            }
        }

        // 2. dfs 수행
        for(int j = 1; j <= M; j++) {
            if(map[1][j])
                dfs(1, j);
        }

        // 3. 출력
        if(answer) bw.write("YES");
        else bw.write("NO");

        bw.close();
        br.close();
    }
}
```

## Answer Code2(24.01.16)

```java
package DFS;
// 24.01.16 침투 복습
import java.util.*;
import java.io.*;

class Penetrate_2 {
    static final int MAX = 1000 + 10;
    static boolean[][] map;
    static int N, M;
    static boolean answer;

    static int[] dirX = {-1, 1, 0, 0};
    static int[] dirY = {0, 0, -1, 1};

    public static void dfs(int x, int y) {
        if(x == N) {
            answer = true;
            return;
        }
        map[x][y] = false;
        for(int i = 0; i < 4; i++) {
            int newX = x + dirX[i];
            int newY = y + dirY[i];
            if(map[newX][newY]) {
                dfs(newX, newY);
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

        // 1. map에 정보반영
        map = new boolean[MAX][MAX];

        for(int i = 1; i <= N; i++) {
            String str = br.readLine();
            for(int j = 1; j <= M; j++) {
                map[i][j] = (str.charAt(j - 1) == '0' ? true : false);
            }
        }
        
        // 2. bfs 호출
        for(int j = 1; j <= M; j++) {
            if(map[1][j]) {
                dfs(1, j);
            }
        }

        // 3. 출력
        if(answer) bw.write("YES");
        else bw.write("NO");
        
        bw.close();
        br.close();
    }
}
```

## 정리

> 문제를 풀기 시작하기 전에, 아래 5가지를 생각해보면서 접근해보자.

1. 상하좌우로 인접한 흰색 격자들로 전달 -> DFS/BFS

2. 서로 연결되었다는 정보를 어떻게 하나의 자료구조로 통합할까? -> 2차원 배열

3. 이미 방문한 지점을 다시 방문하지 않으려면 어떤 자료구조를 사용해야 할까? 

4. visited 배열을 생략할 수는 없을까?

5. 어느 지점에서 dfs를 시작할까?

## Review

* visited 없이 map으로만 할 경우 **`처리 시간`이 1892(ms) -> 1356(ms) 줄었다**는 걸 확인할 수 있다.

* 그래도 이해를 위해 우선 visited 변수를 사용해서 풀어보고, 완전히 dfs를 이해했다면 이후에는 visited 없이도 바로 생각할 수 있도록 하자.