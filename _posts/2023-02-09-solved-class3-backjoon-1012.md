---
layout: post
title: " [solved.ac] Class3++ 1012. 유기농 배추 "
categories: Algorithm
author: fancy96
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/1012)

### 성능 요약

* 메모리: 16044 KB, 시간: 164 ms - Answer Code1(2023.02.09) - BFS

* 메모리: 16236 KB, 시간: 160 ms - Answer Code2(2023.02.09) - DFS

### 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 너비 우선 탐색(bfs), 깊이 우선 탐색(dfs)

### Answer Code1(2023.02.09) - BFS

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

### Answer Code2(2023.02.09) - DFS

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

* 성능으로만 보면 시간은 거의 동일하고, 메모리 용량은 `bfs` 가 더 작게 나왔다.

* bfs(너비 우선 탐색), dfs(깊이 우선 탐색) 에 대한 개념은 알았으나, 코드로 구현하는 과정이 어려워서 결국 구글링의 도움을 받았다.

* 해당 문제는 추후에 다시 풀도록 하자.

* bfs, dfs 에 대한 개념 및 문제 풀이는 나중에 꼭 업로드를 하자.