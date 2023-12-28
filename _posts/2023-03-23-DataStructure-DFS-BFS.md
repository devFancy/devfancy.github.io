---
layout: post
title: " 기본적인 그래프 기법 : DFS, BFS "
categories: DataStructure
author: devFancy
use_math: true
---
* content
{:toc}


## 기본 그래프 작업

* 그래프 순회는 다음과 같은 규칙을 가진다.

    * 주어진 G=(V, E)을 가지고 V(G)의 정점 v는 v에서 도달할 수 있는 모든 정점을 방문할 수 있다.

* 기본적인 그래프 기법은 DFS, BFS가 있다.

* `DFS`는 `Depth First Search`의 약자로 **깊이 우선 탐색**을 말하며, Preorder 트리 순회와 비슷하다. (Preorder : VLR)

    * 그리고 DFS는 스택 또는 재귀를 사용한다.

* `BFS`는 `Breath First Search`의 약자로 **너비 우선 탐색**을 말하며, 층마다 트리를 순회하는 것과 비슷하다.

    * 그리고 BFS는 큐를 사용한다.


## DFS

* 루트 노드에서 시작해서 다음 분기로 넘어가기 전에, 해당 분기를 모두 탐색하는 방법이다. 해당 분기를 탐색한 후에는 다시 원점으로 돌아가 다른 분기를 탐색한다.

* 자기 자신을 호출하는 순환 알고리즘으로 **스택** 또는 **재귀**의 형태를 가진다.

* 이 알고리즘을 구현할 때 그래프 탐색의 경우 **어떤 노드를 방문했었는지 여부를 반드시 검사해야 한다**는 것이다. (검사하지 않으면 무한루프에 빠질 수 있다)

* **미로**를 탐색할 때, **해당 분기에서 갈 수 있을 때까지 가다가 더이상 갈 수 없게 되면, 이전 길로 되돌아가면서 다른 방향으로 다시 탐색을 진행하는 방법**과 유사하다. 

* BFS보다 더 간단하지만, 검색 속도 자체는 BFS보다 느리다.

* `인접 리스트`일 때 DFS 하나당 각 정점에 연결되어 있는 간선의 개수(e)만큼 탐색을 하게 되므로 예측이 불가능하다.

* 하지만 DFS가 끝난 경우를 생각했을 때, 모든 정점을 한번씩 방문하고(n), 모든 간선을 한번씩 모두 검사했으므로 **O(n+e)** 의 시간이 걸린다.

* `인접 행렬`일 때 DFS 하나당 loop를 돌게 되므로 O(n)의 시간 복잡도를 가진다. 그리고 N개의 정점을 모두 방문해야 하므로 n*O(n)으로 **$O(n^{2})$** 의 시간이 걸린다.

* 결론적으로, 인접 리스트의 경우 시간 복잡도가 **$O(n+e)$** 이고, 인접 행렬의 경우 시간 복잡도가 **$O(n^{2})$** 이다.

### DFS 장/단점

> 장점

* 구현이 너비 우선 탐색(BFS)보다 간단하다.

* **현재 경로상의 노드들만 기억하면 되므로, 저장 공간의 수요가 비교적 적다.**

* **목표 노드가 깊은 단계에 있는 경우 해를 빠르게 찾을 수 있다.**

> 단점

* 단순 검색 속도는 너비 우선 탐색(DFS)보다 느리다.

* 해가 없는 경우에 빠질 가능성이 있다.

  (사전이 임의의 깊이를 지정한 후 탐색하도록 하고, 목표 노드를 발견하지 못할 경우 다음 경로를 탐색하도록 한다)

* 깊이 우선 탐색은 해를 구하면 탐색이 종료되므로, 구한 해가 최단 경로가 된다는 보장이 없다.

  (목표에 이르는 경로가 다수인 경우 구한 해가 최적이 아닐 수 있음)

## BFS

* 루트 노드에서 시작하여 둘째 층을 왼쪽에서 오른쪽으로 훓어나가고, 그 다음 층 역시 왼쪽에서 오른쪽으로 훑어나가는 식으로 검색을 한다.

* BFS는 재귀적으로 동작하지 않는다. BFS는 방문한 노드들을 차례로 저장한 후 꺼내는 **선입선출**(FIFO) 방식으로 탐색하여 **큐**를 사용한다.

* 이 알고리즘 역시 DFS와 마찬가지로 **어떤 노드를 방문했었는지 여부를 반드시 검사해야 한다**는 것이다. (검사하지 않으면 무한루프에 빠질 수 있다)

* 시작 정점에서 가장 가까운 정점을 먼저 방문하고 멀리 떨어져 있는 정점을 나중에 방문하는 순회 방법이다.

* DFS와 마찬가지로, 인접 리스트의 경우 시간 복잡도가 **$O(n+e)$** 이고, 인접 행렬의 경우 시간 복잡도가 **$O(n^{2})$** 이다.


### BFS 장/단점

> 장점

* 너비를 우선으로 탐색하기 때문에 **답이 되는 경로가 여러 개인 경우에도 최단경로임을 보장**한다.

* 최단 경로가 존재하면 깊이가 무한정 깊어진다고 해도 최단 경로를 찾을 수 있다.

*  **노드 수가 적고 깊이가 얕은 해가 존재**할 때 DFS보다 유리하다.

> 단점

* 재귀호출을 사용하는 DFS와 달리 큐를 이용해 다음에 탐색할 노드들을 저장하기 때문에 **노드의 수가 많을 수록 필요없는 노드들까지 저장해야 하므로 더 큰 저장공간이 필요**하다.

* 노드의 수가 늘어나면 탐색해야 하는 노드가 많아지기 때문에 **비효율적**이다.

## DFS, BFS 구현

* [Class3++ 1260. DFS와 BFS](https://devfancy.github.io/solved-class3-backjoon-1260/) 문제를 DFS와 BFS를 이용하여 풀었다.

### 정답 코드

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


##  Reference

* [프로그래밍 면접 이렇게 준비한다](http://www.yes24.com/Product/Goods/75187284)

* 학교 수업 내용 - [Fundamentals of data structures in C, 2nd edition - Trees](https://www.amazon.com/Fundamentals-Data-Structures-Ellis-Horowitz/dp/0929306406)

* [[Java] DFS, BFS 정리](https://bbangson.tistory.com/42)

* [[알고리즘] 깊이 우선 탐색(DFS)과 너비 우선 탐색(BFS)](https://currygamedev.tistory.com/10)

* [Java DFS(Depth First Search) 구현하기](https://freestrokes.tistory.com/88)