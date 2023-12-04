---
layout: post
title: " [solved.ac] Class3++ 1012. 유기농 배추 "
categories: Algorithm
author: fancy96
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/1012)

## 성능 요약

* 메모리: 15792 KB, 시간: 164 ms - Answer Code3(2023.12.04) - DFS

* 메모리: 16044 KB, 시간: 164 ms - Answer Code2(2023.02.09) - BFS

* 메모리: 16236 KB, 시간: 160 ms - Answer Code1(2023.02.09) - DFS

## 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 너비 우선 탐색(bfs), 깊이 우선 탐색(dfs)

## Answer Code3(2023.12.04) - DFS

```java
// 유기농 배추 (백준 1012)

import java.util.*;
import java.io.*;

class OrganicCabbage {
    static final int MAX = 50 + 10;
    static boolean[][] map;
    static boolean[][] visited;
    static int T, M, N, K;
    static int[] dirY = {-1, 1, 0, 0};
    static int[] dirX = {0, 0, -1, 1};

    static void dfs(int y, int x) {
        visited[y][x] = true;
        for(int i = 0; i < 4; i++) {
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

        T = Integer.parseInt(br.readLine());

        while(T-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            M  = Integer.parseInt(st.nextToken());
            N  = Integer.parseInt(st.nextToken());
            K  = Integer.parseInt(st.nextToken());

            map = new boolean[MAX][MAX];
            visited = new boolean[MAX][MAX];

            // 1. map에 정보 반영
            int x, y;
            for(int i = 0; i < K; i++) {
                st = new StringTokenizer(br.readLine());
                x = Integer.parseInt(st.nextToken());
                y = Integer.parseInt(st.nextToken());
                map[y+1][x+1] = true;
            }


            // 2. dfs(재귀 함수) 호출
            int answer = 0;
            for(int i = 1; i <= N; i++) {
                for(int j = 1; j <= M; j++) {
                    if(map[i][j] && visited[i][j] == false) {
                        answer++;
                        dfs(i, j);
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

### 문제풀이

* 첫 번째 예제를 기반으로 문제를 접근해보면,

    * 가로 M이 10개이고, 세로 N은 8개로 주어졌을 경우, 실제 배열은 0부터 시작하기 때문에 +1를 더해서 가로는 11개, 세로는 9개 배열을 선언해준다.

    * K개의 위치에 있는 곳에 `true`로 바꿔준다.

* 문제에서는 (0,0)부터 (N-1,N-1) 위치를 준다. 하지만 그렇게 하면 연산이 복잡해지기 때문에, (1,1)부터, (N,N)까지 쓰도록 정의하겠다.

    * (1,1)부터, (N,N)까지 쓰도록 정의하는게 더 유리한 이유는 아래에 문제를 풀고 난 이후에 설명할 예정이다.

* **`visited` 배열을 2차원 배열**을 쓰는 이유는 map 정보를 통째로 주어졌기 때문에, 이 map에서 방문을 했는지, 안했는지 확인하기 위해서이다.

* 이번 문제에서 dfs가 어떻게 동작하는지 확인해보면,

    * (1,1)부터 시작하고, 여기서 배추가 존재하는지 확인하고, 만약 존재한다면 해당 위치인 `visited` 배열에 true로 바꿔준다.

    * 그리고 흰 지렁이가 필요하기 때문에, 여기서 `answer`에 값을 +1 추가해준다.

    * 그런 다음, (1,1)을 기준으로 상하좌우를 확인해보고, 상하좌우 중에서 아직 방문하지 않은 곳이 있다면, 거기를 방문해준다.

    * 첫 번째 예시에 따르면, (1,2)에 배추가 존재하고, 아직 방문하지 않았기 때문에 해당 위치인 `visited` 배열에 true로 바꿔준다.

    * 정리하자면, 내가 어떤 지점을 방문할 때마다 **'이 지점은 이미 방문한 적이 있다'고 `visited` 배열을 사용**하고, **다음으로 방문할 지점을 찾기 위해서 그 지점에 배추가 존재하는지, 존재하지 않는지 `map`이라는 자료구조를 사용하는 것**이다.

### Step1. map에 정보 반영

```java
class OrganicCabbage {
    public static void main(String[] args) throws IOException {
        // 1. map에 정보 반영
        int x, y;
        for (int i = 0; i < K; i++) {
            st = new StringTokenizer(br.readLine());
            x = Integer.parseInt(st.nextToken());
            y = Integer.parseInt(st.nextToken());
            map[y + 1][x + 1] = true;
        }
    }
}
```

* `map[y+1][x+1] = true;`을 한 이유는 예제1에서 확인해보면 (4,2)라고 되어있지만, 문제에서는 (0,0)부터 시작하고, 나는 (1,1)부터 시작하기 때문에 (5,3)이 되어야 하기 때문에 x,y값에 각각 +1를 추가해준것이다.

    그리고 (5,3)에서 배추가 있다고 했는데, 막상 그림으로 확인했을 때는 (3,5)에 '1'로 되어있기 때문에, x와 y 좌표를 반대로 해서 true를 넣어줬다. => `[y+1][x+1]`


### Step2. dfs 수행

```java
class OrganicCabbage {
    public static void main(String[] args) throws IOException {
        // 2. dfs(재귀 함수) 호출
        int answer = 0;
        for(int i = 1; i <= N; i++) {
            for(int j = 1; j <= M; j++) {
                answer++;
                dfs(i, j);
            }
        }
    }
}
```

* (1,1)부터 (N,N)까지 배추가 존재하는 모든 위치를 돌기 때문에, 이중 반복문을 돌면서 확인한다.

* 그런 다음, 우선 answer을 증가시키고, dfs(i, j)를 호출한다.

    즉, 지렁이 한 마리를 소비하고, 그 지점을 기반으로 dfs를 돌겠다는 의미이다.

* 그런데, 모든 지점마다 돌면 의미가 없기 때문에 answer 값을 증가시키기 이전에, 조건문을 추가해준다.

    `if(map[i][j] && visited[i][j] == false)`의 의미는 **해당 위치에 배추가 존재하고 && 방문한적이 없다면** answer를 +1 증가시키고, dfs를 호출한다는 것이다.

```java
class OrganicCabbage {
    static int[] dirY = {-1, 1, 0, 0};
    static int[] dirX = {0, 0, -1, 1};

    static void dfs(int y, int x) {
        visited[y][x] = true;
        for(int i = 0; i < 4; i++) {
            int newY = y + dirY[i];
            int newX = x + dirX[i];
            if(map[newY][newX] && visited[newY][newX] == false) {
                dfs(newY, newX);
            }
        }
    }
}
```

* 여기서 dirY, dirX 배열을 선언한 이유는 4가지 방향(상하좌우)을 확인하기 위해서이다.

* 만약 dirY, dirX 배열을 선언하지 않는다면 아래와 같이 dfs를 호출해야 한다.

```java
class OrganicCabbage {
    static void dfs(int y, int x) {
        visited[y][x] = true;
        dfs(y - 1, x);
        dfs(y + 1, x);
        dfs(y, x - 1);
        dfs(y, x + 1);
    }
}
```

* 위와 같이 한다면, **똑같은 코드가 중복되고, 예외처리가 어렵기 때문에** dirY, dirX 배열을 따로 선언한 것이다.

* 문제를 풀때 (0,0)부터 안하고 **(1,1)부터 시작한 이유**는 다음과 같은 단점이 있다.

    만약 (0,0)부터 시작한다고 가정하고, 4가지 방향을 확인할 때 `newY`, `newX`가 범위를 벗어나는지(0보다 작은지) 확인해야 한다.

    범위를 벗어나면 dfs를 접근하지 못하도록 막아주는 로직이 필요하다.

### visited 없이 map으로만 문제를 푸는 경우

![](/assets/img/algorithm/Algorithm-Baekjoon-1012.jpeg)

* 그런데 문제를 풀어나가다 보면, **`visited` 2차원 배열이 `map` 2차원 배열과 같은 구조인 것을 확인**할 수 있다.

* 그래서 visited 2차원 배열없이, map만 사용하기 위해서는 우선 선언한 `visited[][]` 배열을 지운다.

    * 그런 다음, 초기화한 부분을 없앤다.

    * if 조건문에서는 배추가 존재하는지, 그리고 방문한 적이 없는지에 대한 것인데, 여기서 `visited[i][j] == false`을 지움으로써 `map[i][j]`에 2가지 조건을 함축적으로 적용할 수 있다.

    * 마지막으로 수정할 부분은 dfs() 메서드 부분인데, 여기서 `visited[y][x] = true`를 `map[y][x] = false`로 바꿔준다. -> 처리를 했으니까 더이상 처리할 필요가 없기 때문에 false로 한 것이다.

    * 그리고 그 밑에 if()문에 있는 `visited[newY][newX] == false`을 지움으로써 `map[newY][newX]`에 함축적으로 2가지 조건을 적용한다.

* 그래서 결과는 아래와 같다.

```java
// 유기농 배추 (백준 1012)

import java.util.*;
import java.io.*;

class OrganicCabbage {
    static final int MAX = 50 + 10;
    static boolean[][] map;
    static int T, M, N, K;
    static int[] dirY = {-1, 1, 0, 0};
    static int[] dirX = {0, 0, -1, 1};

    static void dfs(int y, int x) {
        map[y][x] = false;
        for(int i = 0; i < 4; i++) {
            int newY = y + dirY[i];
            int newX = x + dirX[i];
            if(map[newY][newX]) {
                dfs(newY, newX);
            }
        }
    }
    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초기화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        T = Integer.parseInt(br.readLine());

        while(T-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            M  = Integer.parseInt(st.nextToken());
            N  = Integer.parseInt(st.nextToken());
            K  = Integer.parseInt(st.nextToken());

            map = new boolean[MAX][MAX];

            // 1. map에 정보 반영
            int x, y;
            for(int i = 0; i < K; i++) {
                st = new StringTokenizer(br.readLine());
                x = Integer.parseInt(st.nextToken());
                y = Integer.parseInt(st.nextToken());
                map[y+1][x+1] = true;
            }


            // 2. dfs(재귀 함수) 호출
            int answer = 0;
            for(int i = 1; i <= N; i++) {
                for(int j = 1; j <= M; j++) {
                    if(map[i][j]) {
                        answer++;
                        dfs(i, j);
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

* 이렇게 하면 프로그램 성능적으로 더 처리가 좋아지지만, 처음 문제를 풀때는 visited를 무조건 쓰는게 좋다. 

* 그게 정석적인 풀이이고, 이 풀이를 이해해야만 '`map` 자료구조만으로도 풀 수 있구나'라는 걸 느낄 수 있다.

## Answer Code2(2023.02.09) - BFS

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;
import java.util.StringTokenizer;

public class Main {

    static int[][] ground;      //2차원 배열로 배추밭을 표현한다
    static boolean[][] check;   //2차원 배열로 배추가 있는 곳을 체크한다
    static int weight;          //배추밭의 가로
    static int height;          //배추밭의 세로

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine());
        StringTokenizer st;
        for (int i = 0; i < T; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            weight = Integer.parseInt(st.nextToken());
            height = Integer.parseInt(st.nextToken());
            ground = new int[weight][height];
            check = new boolean[weight][height];

            int K = Integer.parseInt(st.nextToken());
            for (int j = 0; j < K; j++) {
                st = new StringTokenizer(br.readLine(), " ");
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                ground[x][y] = 1;   //배추 좌표 입력
            }
            //===========================================================
            //여기까지는 입력된 내용 저장하는 내용이다.

            int count=0;    //테스트 케이스마다 지렁이의 개수를 세야한다
            
            //bfs의 시작좌표를 셋팅해서 다른 곳에 모여있는 배추들도 파악할 수 있게한다
            //가로 세로 좌표들을 하나씩 입력해주고
            for (int j = 0; j < weight; j++) {
                for (int k = 0; k < height; k++) {
                    
                    //좌표에 배추가 있는지 확인, 내가 체크안한 곳인지 확인한다
                     if(ground[j][k] == 1 && !check[j][k]){
                         //배추가 있고 체크안된 좌표에서부터 bfs로 연결된 곳을 파악한다
                         bfs(j, k);
                         
                         //지렁이의 개수는 인접한 곳마다 1개씩이다.
                         //인접한 곳을 모두 파악했으면 지렁이를 한마리 놓는다.
                         count++;
                     }
                }
            }

            System.out.println(count);
        }

    }

    private static void bfs(int startX, int startY) {
        Queue<int[]> queue = new LinkedList<>();
        //bfs에서 queue의 역할은 다음 탐색할 좌표를 미리 저장해 놓는 것이다.
        //bfs 1번 실행될때마다 인접한 곳을 모두 탐색하고 종료되니 bfs안에 queue를 선언했다.
        
        queue.offer(new int[] {startX, startY});
        //x, y좌표 저장
        
        check[startX][startY] = true;
        //시작좌표엔 배추가 있으니 미리 true로 처리해준다.
        
        int[] X = {0, 0, -1, +1};
        int[] Y = {-1, +1, 0, 0};
        //배추가 상하좌우에 인접하면 이동할 수 있다.
        //현재좌표에서 상하좌우 움직이는 좌표를 지정한다.

        //queue가 비어있으면 더이상 인접한 배추가 없다는 뜻이다.
        while(!queue.isEmpty()){
            int[] poll = queue.poll();
            //저장된 queue를 꺼낸다
            
            //상하좌우 4가지 방법이니 for문 4번 반복
            for (int i = 0; i < 4; i++) {
                int x = poll[0] + X[i];
                int y = poll[1] + Y[i];
                //상하좌우 좌표 조정

                //좌표가 배추밭을 벗어나게되면 다음 좌표를 체크해야한다
                if(x < 0 || x >= weight || y < 0 || y >= height){
                    continue;
                }

                //상하좌우 움직인 좌표에 배추가 있고, 체크하지 않은 좌표이면
                if(ground[x][y] == 1 & !check[x][y]){
                    queue.offer(new int[] {x, y});
                    //좌표를 저장한다.
                    check[x][y] = true;
                    //체크한다
                }

            }
        }

    }

}
```

## Answer Code1(2023.02.09) - DFS

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;
import java.util.StringTokenizer;

public class Main {

    static int[][] ground;      //2차원 배열로 배추밭을 표현한다
    static boolean[][] check;   //2차원 배열로 배추가 있는 곳을 체크한다
    static int weight;          //배추밭의 가로
    static int height;          //배추밭의 세로

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine());
        StringTokenizer st;
        for (int i = 0; i < T; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            weight = Integer.parseInt(st.nextToken());
            height = Integer.parseInt(st.nextToken());
            ground = new int[weight][height];
            check = new boolean[weight][height];

            int K = Integer.parseInt(st.nextToken());
            for (int j = 0; j < K; j++) {
                st = new StringTokenizer(br.readLine(), " ");
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                ground[x][y] = 1;   //배추 좌표 입력
            }
            //===========================================================
            //여기까지는 입력된 내용 저장하는 내용이다.

            int count=0;    //테스트 케이스마다 지렁이의 개수를 세야한다

            //bfs의 시작좌표를 셋팅해서 다른 곳에 모여있는 배추들도 파악할 수 있게한다
            //가로 세로 좌표들을 하나씩 입력해주고
            for (int j = 0; j < weight; j++) {
                for (int k = 0; k < height; k++) {

                    //좌표에 배추가 있는지 확인, 내가 체크안한 곳인지 확인한다
                     if(ground[j][k] == 1 && !check[j][k]){
                         //배추가 있고 체크안된 좌표에서부터 dfs로 연결된 곳을 파악한다
                         dfs(j, k);

                         //지렁이의 개수는 인접한 곳마다 1개씩이다.
                         //인접한 곳을 모두 파악했으면 지렁이를 한마리 놓는다.
                         count++;
                     }
                }
            }

            System.out.println(count);
        }

    }

    private static void dfs(int startX, int startY) {
        check[startX][startY] = true;
        //시작좌표엔 배추가 있으니 미리 true로 처리해준다.

        int[] X = {0, 0, -1, +1};
        int[] Y = {-1, +1, 0, 0};
        //배추가 상하좌우에 인접하면 이동할 수 있다.
        //현재좌표에서 상하좌우 움직이는 좌표를 지정한다.

        //상하좌우 4가지 방법이니 for문 4번 반복
        for (int i = 0; i < 4; i++) {
            int x = startX + X[i];
            int y = startY + Y[i];
            //상하좌우 좌표 조정

            //좌표가 배추밭을 벗어나게되면 다음 좌표를 체크해야한다
            if(x < 0 || x >= weight || y < 0 || y >= height){
                continue;
            }

            //상하좌우 움직인 좌표에 배추가 있고, 체크하지 않은 좌표이면
            if(ground[x][y] == 1 & !check[x][y]){
                dfs(x, y);	//해당 좌표로 dfs 실행
            }

        }


    }

}
```

## Review

> 2023.12.04

* 이전에는 DFS에 대한 개념, 그리고 dirX, dirY 같은 배열을 왜 사용하는지, 전체적인 로직 흐름을 이해하지 못했지만,

  이번에 그림으로 다시 풀고, 하나의 로직에도 Why?라는 접근법을 통해 깊게 학습과 정리를 함으로써, 제대로 인풋과 아웃풋을 확실히 할 수 있었다.

> 2023.02.09

* 성능으로만 보면 시간은 거의 동일하고, 메모리 용량은 `bfs` 가 더 작게 나왔다.

* bfs(너비 우선 탐색), dfs(깊이 우선 탐색) 에 대한 개념은 알았으나, 코드로 구현하는 과정이 어려워서 결국 구글링의 도움을 받았다.

* 해당 문제는 추후에 다시 풀도록 하자.

* bfs, dfs 에 대한 개념 및 문제 풀이는 나중에 꼭 업로드를 하자.

## Reference

* [[백준] 1012 유기농배추 자바 BFS, DFS](https://lotuus.tistory.com/98)