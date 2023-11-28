---
layout: post
title: " [solved.ac] Class3++ 2606. 바이러스 (DFS) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/2606)

## 성능 요약

* 메모리: 14236 KB, 시간: 120 ms

## 구분

* 그래프 이론(graphs), 그래프 탐색(graph_traversal), 깊이 우선 탐색(dfs)

## Answer Code(2023.11.28)

```java
import java.util.*;
import java.io.*;


class Main {
    static boolean[][] graph;
    static boolean[] visited;
    static int N, M;
    static int answer;

    public static void dfs(int idx) {
        visited[idx] = true;
        answer++;

        for(int i = 1; i <= N; i++) {
            if(visited[i] == false && graph[idx][i]) {
                dfs(i);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        N = Integer.parseInt(br.readLine());
        M = Integer.parseInt(br.readLine());

        graph = new boolean[N + 1][N + 1];
        visited = new boolean[N + 1];

        // 1. graph에 연결 정보 채우기
        int x, y;
        for(int i = 0; i < M; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            x = Integer.parseInt(st.nextToken());
            y = Integer.parseInt(st.nextToken());
            graph[x][y] = true;
            graph[y][x] = true;
        }
        // 2. dfs(재귀함수) 호출
        dfs(1);

        // 3. 출력
        bw.write(String.valueOf(answer -1));
        
        br.close();
        bw.close();
    }
}
```

### 문제풀이

* 문제를 읽어보면서, 해당 문제가 어느 알고리즘에 해당하는지 생각해야 한다.

    * 한 컴퓨터가 웜 바이러스에 걸리면 그 컴퓨터와 **네트워크 상에서 `연결`되어 있는 컴퓨터**는 웜 바이러스에 걸리게 된다.

    * 예를 들어 7대의 컴퓨터가 <그림>1과 같이 **네트워크 상에서 연결되어 있다**고 하자 -> '그래프에서 `연결`되어 있는 걸 `탐색`해야 겠다' -> DFS/BFS를 써야 겠다.

* 해당 문제를 통해 그래프를 정의하고 어떻게 채우는지 중요하고,

  어떻게 하면 재방문을 방지할 수 있는지 고민해야 된다. -> `visited` 배열을 활용한다.

* `visited` 배열을 선언할 때 **n+1**를 해줘야 한다.

    컴퓨터가 7대 있지만, 번호를 1번부터 7번까지 쓸 것이므로 실제로 내가 필요한 배열의 크기는 n+1개 이다.

    즉, 8개짜리 배열이 필요하다.

* 결론적으로 **알고리즘 흐름도**는 다음과 같다.

    [0] 입력 및 초기화 -> [1] graph에 연결 정보 채우기(인접 행렬에 값 넣어주기) -> [2] dfs(재귀함수) 호출하기 -> [3] 출력하기

#### Step0. 입력 및 초기화

```java
import java.util.*;
import java.io.*;

class Main {
    static boolean[][] graph;
    static boolean[] visited;
    static int N, M;
    static int answer;

    public static void main(String[] args) throws IOException {
        // 0. 입력 및 초화
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        N = Integer.parseInt(br.readLine());
        M = Integer.parseInt(br.readLine());

        graph = new boolean[N + 1][N + 1];
        visited = new boolean[N + 1];
    }
}
```

* `BufferedReader`, `BufferedWriter`는 입출력을 조금더 빠르게 하기 위해 사용하는 메서드다.

    * 버퍼를 통해 읽고 쓰는 함수이고, 입출력 데이터가 바로 전달되지 않고 중간에 버퍼링이 된 후 전달된다. -> 속도가 빠르다.

    * 맨 위에 `import.java.io.*`과, main 뒤에 `throws IOException`을 선언해줘야 한다.

* `BufferedReader`는 입력 스트림에서 문자를 읽는 함수이다. 문자나 배열, 라인들을 효율적으로 읽기 위해 문자들을 버퍼에 저장하고 (버퍼링) 읽는 방법을 취한다.

    * BufferedReader 사용법

        * `readLine()`: `BufferedReader`을 통해서 한 줄의 입력값을 **String 형**으로 반환해준다.

        *  `Scanner` 처럼 공백 단위로 끊어주지 못한다. 엔터만 경계로 인식한다.

* `graph = new boolean[N + 1][N + 1];`을 사용하는 이유는 컴퓨터가 1번부터 7번 까지 있는데, **`N * N` 으로 하면은 0번부터 6번까지 존재**하기 때문에, N에다가 +1를 해주는 것이다.

    마찬가지로 `visited[] = new boolean[N + 1]`로 해준다.

#### Step1: graph에 연결 정보 채우기

```java
class Main {
    public static void main(String[] args) throws IOException {
      ...
      // 1. graph에 연결 정보 채우기
      int x, y;
      for(int i = 0; i < M; i++) {
        StringTokenizer st = new StringTokenizer(br.readLine());
        x = Integer.parseInt(st.nextToken());
        y = Integer.parseInt(st.nextToken());
        graph[x][y] = true;
        graph[y][x] = true;
      }
      ...
    }
}
```

* 입력받을 변수 x,y 를 만들어주고, i=0부터 M보다 작을때까지 반복한다.

    즉, M개의 간선 정보를 입력받는데, 이때 M은 2개의 숫자가 한 줄에 들어오기 때문에 `StringTokenzer`을 사용한다.

    `StringTokenizer st = new StringTokenizer(br.readLine());`을 통해 **한 줄에 입력받은 모든 정보를 String으로 변환한 뒤, 띄어쓰기를 기준으로 나눠준다**는 의미이다.

    `x = st.nextToken`은 띄어쓰기를 기준으로 나눈 것중에 그 다음 값을 달라는 의미이다. 초기에는 nextToken을 처음 불러왔기 때문에 첫번째 숫자를 불러온다.

    하지만, x 값도 String으로 받아왔기 때문에 Integer로 바꾸기 위해서는 `Integer.parseInt()`를 사용해야 한다. => `x = Integer.parseInt(st.nextToken());`

    마찬가지로 두번째 숫자를 받기 위해서 y라는 변수를 활용한다. => `y = Integer.parseInt(st.nextToken());`

    그리고 그래프에 간선 정보를 반영하기 위해서 true를 이용한다. => `graph[x][y] = true`, `graph[y][x] = true;` 

    x번 컴퓨터와 y번 컴퓨터가 서로 연결되어 있기 때문에 2번 적어주는 것이다.

#### Step2: dfs(재귀함수) 호출하기

* `dfs(1)`을 한 이유는 1번 컴퓨터부터 시작한다는 의미를 전달하기 때문이다.

```java
class Main {
    public static void dfs(int idx) {
      visited[idx] = true;
      answer++;
  
      for(int i = 1; i <= N; i++) {
        if(visited[i] == false && graph[idx][i]) {
          dfs(i);
        }
      }
    }
    public static void main(String[] args) throws IOException {
      ...
        // 2. dfs(재귀함수) 호출
        dfs(1);
    }
}
```

* dfs 함수는 내가 현재 몇 번째(idx) 인덱스를 처리하고 있는지, 그 값을 인자로 받아서 동작한다는 의미이다.

    맨 처음에는 `visited[idx] = true;`을 통해 가장 처음에 온 1번 컴퓨터는 이미 방문했다는 것으로, 다시는 방문하지 말라는 의미이다.

* 그 뒤에 `answer++`을 해준 이유는 dfs를 호출되는 횟수만큼 **몇개의 컴퓨터가 연결되었다는 의미**이기 때문이다.

* 그리고 지금의 인덱스를 기준으로 **나와 연결되는 번호가 1번부터 N번까지 몇개 있는지 `반복문`을 통해 확인**한다.  => `for(int i = 1; i <= N; i++)`

    만약 연결되어 있다면, dfs(재귀 함수)를 통해서 호출한다는 것이다.
 
    여기서 `if(visited[i] == false)`을 통해 이미 방문한 적이 없는지 확인하기 위해 반복문 바로 다음에 작성한다.

    그리고 동시에 `&& graph[idx][i]`을 한 이유는 idx 기준으로 i번 컴퓨터와 연결이 되어있는지 봐야한다.

    이 조건을 요약해보자면, i번째에 방문하지 않았는데, 지금 들어온 idx번 컴퓨터가 i번 컴퓨터와 연결되어 있다면, dfs라는 재귀함수를 통해 i번째에 간다는 것이다.

#### Step3: 출력하기

* 출력하기 전에, `BufferedWriter`에 대한 사용법부터 익히고 가자.

* `BufferedWriter`는 한번에 모았다가 출력할 때 사용하는 함수이다. 버퍼를 정의했기 때문에 반드시 `flush()/close()`를 호출해 뒤처리를 해줘야한다.

    * `System.out.println()` 처럼 자동개행 기능이 없기 때문에 **개행이 필요한 경우 `\n` 을 통해 따로 처리해 주어야한다.**

    * BufferedWriter 사용법

        * `bw.write(int n)` 를 통해 int 형으로 문자 데이터를 출력문자 스트림으로 출력한다.

```java
class Main {
public static void main(String[] args) throws IOException {
// 3. 출력
        bw.write(String.valueOf(answer -1));
        
        br.close();
        bw.close();
    }
}
```

* 여기서는 `bw.write(answer -1)`을 통해 1번과 연결과 관련된 컴퓨터가 몇개 인지 출력한다는 의미이고, 1을 제외한 연결된 갯수를 구하는 문제이기 때문에 `-1`를 해주는 것이다.

    다만, `BufferedWriter`도 **String으로 전달**해줘야 하기 때문에, `String.valueOf()` 함수를 통해 해당 Object의 값을 String으로 변환해주고,

    그 변환된 값을 `BufferedWriter`을 통해 Write 해준다.

    마지막으로 `br.close()`, `bw.close()`를 해주면 된다.

### 정리

1. 네트워크 상에서 연결 -> `DFS/BFS`

2. 서로 연결되었다는 정보를 어떻게 하나의 자료구조로 통합할까?

3. 이미 방문한 지점을 다시 방문하지 않으려면 어떤 자료구조를 사용해야 할까? 

고민 -> 그래프 & visited 배열 활용한다.

## Review

* DFS에 대한 개념을 확실히 이해하기 위해 그림도 그리면서 문제를 풀었는데 1시간이 훌쩍 지나가버렸다.

* DFS에 대한 이해가 이전에는 70%였다면, 이제는 90%까지 된 것 같다.

* 해당 문제는 DFS를 이해하는데 중요한 문제인 만큼 3번까지는 그림을 그리면서 복습해 나가자!

## Reference

* [[자바/Java] 문과생도 이해하는 DFS 알고리즘! -입문편](https://www.inflearn.com/course/%EC%9E%90%EB%B0%94-%EB%AC%B8%EA%B3%BC%EC%83%9D%EB%8F%84-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-dfs-%EC%9E%85%EB%AC%B8/dashboard)

* [JAVA - BufferedReader, BufferedWriter](https://doozi316.github.io/java/2021/03/22/JAVA1/)