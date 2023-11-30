---
layout: post
title: " [백준] 2644번. 촌수계산(DFS) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/2644)

## 성능 요약

* 메모리: 14148 KB, 시간: 120 ms

## 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 너비 우선 탐색(bfs), 깊이 우선 탐색(dfs)

## Answer Code

```java
import java.util.*;
import java.io.*;

class Villages {
    static final int MAX = 100 + 10;
    static boolean[][] graph;
    static boolean visited[];
    static int N, M, start, end, answer;
    
    public static void dfs(int idx, int count) {
        visited[idx] = true;
        if(idx == end) {
            answer = count;
            return;
        }

        for(int i = 1; i <= N; i++) {
            if(visited[i] == false && graph[idx][i]) {
                dfs(i, count + 1);
            }
        }
    }

    public static void main(String args[]) throws IOException {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        N = Integer.parseInt(br.readLine());

        StringTokenizer st = new StringTokenizer(br.readLine());
        start = Integer.parseInt(st.nextToken());
        end = Integer.parseInt(st.nextToken());

        M = Integer.parseInt(br.readLine());

        // 1. graph에 연결 정보 채우기
        graph = new boolean[MAX][MAX];
        visited = new boolean[MAX];
        answer = -1;


        for(int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());
            graph[x][y] = true;
            graph[y][x] = true;
        }

        // 2. dfs(재귀 함수)호출 하기
        dfs(start, 0);

        // 3. 출력하기
        bw.write(String.valueOf(answer));

        bw.close();
        br.close();
    }
}
```

## Review

* 위 문제는 부모-자식간의 관계를 나타내는 두 번호를 **트리 형태**로 그려주면 쉽게 파악할 수 있는 문제였다.

* 특이한 점은 dfs를 호출할 때 `dfs(start, 0)`을 썼는데, 여기서 `0`은 현재 DFS가 실행되는 시점에 촌수가 몇촌인지 담아주는 의미이다.

    처음 시작이 0이기 때문에, 0을 넣은 것이다.

* 그리고 dfs 함수에서 `count`는 **처음 입력받았던 `start`와 현재 실행하고 있는 `idx`가 몇촌 사이인지 알려주는 값**이다.

    만약 `idx`가 도착지에 갔다면, 해당 `count` 값이 촌수를 계산하는 값이 되므로 `count` 값을 `answer`에 넣은 것이다. (answer == count)

* 그 외에 나머지 풀이는 이전 바이러스, 연결요소의 개수, 깊이 우선 탐색과 동일한 유형인 **연결된 요소 찾기**와 비슷해서 문제풀이를 생략했다.
