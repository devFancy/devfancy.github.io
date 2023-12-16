---
layout: post
title: " [solved.ac] Class3++ 1260. DFS와 BFS "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/1260)

## 성능 요약

* 메모리: 24156 KB, 시간: 368 ms

## 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 너비 우선 탐색(bfs), 깊이 우선 탐색(dfs)

## Answer Code1(2023.02.09)

```java
import java.io.*;
import java.util.*;

public class Main {
    static int [][] check; //간선 연결상태
    static boolean [] checked; //확인 여부
    static int n; //정점 개수
    static int m; //간선 개수
    static int start; // 시작정점

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        StringTokenizer st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());
        start = Integer.parseInt(st.nextToken());

        check = new int[1001][1001]; // 좌표를 그대로 받아들이기 위해 +1 해서 선언
        checked = new boolean[1001]; // 초기값 : false

        //간선 연결상태 저장
        for(int i = 0; i < m; i++) {
            StringTokenizer str = new StringTokenizer(br.readLine());

            int x = Integer.parseInt(str.nextToken());
            int y = Integer.parseInt(str.nextToken());

            check[x][y] = check[y][x] = 1;
        }

        //dfs 호출
        dfs(start);

        checked = new boolean[1001]; // 확인상태 초기화
        System.out.println(); // 줄바꿈

        //bfs 호출
        bfs(start);
    }

    //시작점을 변수로 받아 확인, 출력 후 다음 연결점을 찾아 시작점을 변경하여 재호출
    public static void dfs(int start) {
        checked[start] = true;
        System.out.print(start + " ");

        for(int j = 1; j <= n; j++) {
            if(check[start][j] == 1 && checked[j] == false) {
                dfs(j);
            }
        }
    }

    public static void bfs(int start) {
        Queue<Integer> queue = new LinkedList<Integer>();

        queue.offer(start); // 시작점도 Queue에 넣어야 함
        checked[start] = true;

        System.out.print(start + " ");

        //Queue가 비어있을 때까지 반복. 방문 정점은 확인, 출력 후 Queue에 넣어 순서대로 확인
        while(!queue.isEmpty()) {
            int temp = queue.poll();

            for(int j = 1; j <= n; j++) {
                if(check[temp][j] == 1 && checked[j] == false) {
                    queue.offer(j);
                    checked[j] = true;
                    System.out.print(j + " ");
                }
            }
        }
    }

}
```

## Answer Code2(2023.11.30)

```java
import java.util.*;
import java.io.*;

class Main {
    static final int MAX = 1000 + 10;
    static boolean[][] graph;
    static boolean[] visited;
    static ArrayList<Integer> queue; // bfs를 위해 만든 것
    static int N, M, V;

    public static void dfs(int idx) {
        visited[idx] = true;
        System.out.print(idx + " "); // 몇 번째 노드를 방문했다.
        
        for(int i = 1; i <= N; i++) {
            if(visited[i] == false && graph[idx][i] == true) {
                dfs(i);
            }
        }
        
    }
    /*
     * bfs() 풀이 과정
     * 1. queue를 만들고, visited를 새로 초기화해준다.
     * 2. 가장 첫 번째 시작 정점이라는 값(1)을 추가해주고, 그 값(1)을 방문했다라고 표기해준다. (처음 V 값이 1이므로)
     * 3. !queue.isEmpty() 때까지, 가장 앞에 있는 값을 꺼내오고, 출력해 준 다음에 그 값을 기준으로 방문할 수 있는 값들을 방문한다.
     * 
     */
    public static void bfs() {
        queue = new ArrayList<>();
        visited = new boolean[MAX];

        queue.add(V);
        visited[V] = true;

        while (!queue.isEmpty()) {
            int idx = queue.remove(0); // 가장 앞에 있는 녀석을 꺼내서 걔를 인덱스에 담겠다.
            System.out.print(idx + " ");

            for(int i = 1; i <= N; i++) {
                if(visited[i] == false && graph[idx][i] == true) {
                    queue.add(i);
                    visited[i] = true;
                }
            }
            
        }
    }
    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        N = Integer.parseInt(st.nextToken());
        M = Integer.parseInt(st.nextToken());
        V = Integer.parseInt(st.nextToken());

        graph = new boolean[MAX][MAX];
        visited = new boolean[MAX];

        // 1. graph에 연결 정보 채우기
        for(int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());
            graph[x][y] = true;
            graph[y][x] = true;
        }

        // 2. dfs(재귀 함수) 호출 + 출력하기
        dfs(V);
        System.out.println();

        // 3. bfs(너비 우선 탐색) 호출 + 출력하기
        bfs();

        // 4. 종료
        br.close();
    }
}
```

## Review

> 23.02.15

* 해당 문제는 dfs, bfs 관련 문제를 **처음 풀기 좋은 정석같은 문제**였다.

* **입출력 부분에서 `BufferedReader` 사용하는 방법**을 처음 알게 되었다. 그동안 Scanner를 이용해서 풀었는데, 이번에는 다른 방식으로 풀면서 해당 개념에 대해 배워서 좋았다.

* `dfs`, `bfs`에 대해서는 관련 문제들을 풀면서 개념을 계속적으로 복습해 나가면서, 최종적으로는 머릿속으로도 문제를 풀 수 있는 실력을 갖추도록 하자.

> 23.11.15

* bfs 문제를 풀 때는 queue 자료구조를 사용하고, 관련 메서드 함수들을 기억해두자.

* 만약 **내림차순**으로 방문한다라고 가정한다면, dfs 함수에서 for문을 `for(int i = N; i >= 1; i--)`로 수정해주면 된다. -> 가장 큰 값부터 가장 작은 값까지 방문한다.

## Reference

* [백준 1260번 DFS와 BFS](https://m.blog.naver.com/lm040466/221787478911)

* [[백준알고리즘-JAVA]1260번 풀이(DFS와 BFS) - 초보도 이해하는 풀이](https://infodon.tistory.com/96)