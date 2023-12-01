---
layout: post
title:  " [백준] 11725. 트리의 부모찾기 "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/2644)

## 성능 요약

* 71236 KB, 시간: 596 ms

## 구분

* 그래프 이론, 그래프 탐색, 트리, 너비 우선 탐색, 깊이 우선 탐색

## Answer Code

```java
import java.util.*;
import java.io.*;

class TreeParentSearch {
    static final int MAX = 100000 + 10;
    static ArrayList<Integer>[] graph;
    static boolean[] visited;
    static int N;
    static int[] answer;

    public static void dfs(int idx) {
        visited[idx] = true;
        for(int i = 0; i < graph[idx].size(); i++) {
            int next = graph[idx].get(i);
            if(visited[next] == false) {
                answer[next] = idx;
                dfs(next);
            }
        }
    }

    public static void main(String[] args) throws IOException{
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        N = Integer.parseInt(br.readLine());
        
        graph = new ArrayList[MAX];
        for(int i = 1; i <= N; i++) {
            graph[i] = new ArrayList<>();
        }
        visited = new boolean[MAX];
        answer = new int[MAX];

        // 1. 연결 정보 채우기
        int x, y;
        for(int i = 0; i < N-1; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            x = Integer.parseInt(st.nextToken());
            y = Integer.parseInt(st.nextToken());
            graph[x].add(y);
            graph[y].add(x);
        }

        // 2. dfs(재귀 함수) 호출하기
        dfs(1);

        // 3. 출력
        for(int i = 2; i <= N; i++) {
            bw.write(String.valueOf(answer[i]));
            bw.newLine();
        }
        bw.close();
        br.close();
    }
}
```

## 문제풀이

* '**각 노드의 부모**를 구하라' => 다른 말로 **연결되어 있는 상태에서 각 노드의 상위 노드가 누구인지 찾는 문제였다.

* 그리고 트리의 루트를 `1`이라고 문제에서 주어졌기 때문에, **최상단 노드는 `1`부터 시작**한다는 의미이다. => `dfs(1);`

```java
class TreeParentSearch {
    public static void dfs(int idx) {
        visited[idx] = true;
        for (int i = 0; i < graph[idx].size(); i++) {
            int next = graph[idx].get(i);
            if (visited[next] == false) {
                answer[next] = idx;
                dfs(next);
            }
        }
    }
}
```

* 우선 해당 노드를 방문했기 때문에, `visited[idx] = true;`를 해준다.

* 그런 다음, `graph[idx].size();` 만큼 반복문을 돌리는 것인데, 

    해석하자면, `ArrayList<Integer>[]`형인 graph에서 해당 index에 있는 size만큼 반복문을 돌리는 것이다.

    예를 들어, 첫번째 예시에서 연결된 두 정점을 통해 1이 연결된 값이 4와 6이라면, 1에 해당하는 size, 즉 `graph[1].size()`는 **2개**를 의미한다.

* 그리고 `next = graph[idx].get(i);`을 해석하자면,

    문제에서 연결된 두 정점을 바탕으로 ArrayList를 그려보면, `graph[1].get(0);` = 6이라는 값이 `next` 변수에 넣어주게 된다.

    그런 다음, 아직 방문하지 않았다면, dfs(재귀 함수)를 호출한다.

    이때, dfs(재귀 함수)를 호출하기 이전에, 부모 노드인 값(idx)을 `answer`라는 변수에 담아준다.

    예를 들어, 1번째 인덱스에서 6이라는 녀석에 dfs를 호출하는데, 6의 부모 노드의 값이 1이므로 `answer[6] = 1`과 같이 `answer`라는 변수에 담아준다.

    그리고 `dfs(6)`을 호출한다.

## Review

* 해당 문제를 아래와 같이, 그림을 그리면서 푸니까 확실히 이해가 되면서 정답을 맞출 수 있었다.

![](/assets/img/algorithm/Algorithm-backjoon-11725.jpeg)

*  매번 이러한 유형의 문제를 접할때 마다 `그래프`라는 자료구조를 어떻게 잡아야 할지, 
    
   그리고 재방문은 어떻게 방지할지, 
    
   마지막으로 정답은 어떤 자료구조에 담아야 잘 출력할지 고민하는 연습을 계속하자.

* 트리/각 노드의 부모를 찾아라 => DFS/BFS

   문제에서 주어진 `N`이라는 값이 크면 `ArrayList`를 이용하자.