---
layout: post
title: " [solved.ac] Class3++ 11724. 연결 요소의 개수(DFS) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://www.acmicpc.net/problem/11724)

## 성능 요약

* 메모리: 113376 KB, 시간: 552 ms

## 구분

* 그래프 이론, 그래프 탐색, 너비 우선 탐색, 깊이 우선 탐색

## Answer Code(2023.11.28)

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.StringTokenizer;
import java.io.*;

class Main {
  final static int MAX = 1000 + 10;
  static boolean[][] graph;
  static boolean[] visited;
  static int N, M;
  static int answer;

  static void dfs(int idx) {
    visited[idx] = true;
    for(int i = 1; i <= N; i++) {
      if(visited[i] == false && graph[idx][i]) {
        dfs(i);
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

    // 1. graph에 연결 정보 채우기
    graph = new boolean[MAX][MAX];
    visited = new boolean[MAX];

    int u, v;
    for(int i = 0; i < M; i++) {
      st = new StringTokenizer(br.readLine());
      u = Integer.parseInt(st.nextToken());
      v = Integer.parseInt(st.nextToken());
      graph[u][v] = true;
      graph[v][u] = true;
    }

    // 2. dfs(재귀함수 호출) - visited가 모두 true일때까지 방문한다.
    for(int i = 1; i <= N; i++) {
      if(visited[i] == false) {
        dfs(i);
        answer++;
      }
    }

    // 3. 출력
    bw.write(String.valueOf(answer));

    bw.close();
    br.close();
  }
}
```

## 문제풀이

* 아이디어: '**연결 요소의 개수**를 구하는 프로그램'에서 `연결`되어 있다는 것을 **그래프에서 탐색하는 방법**으로 풀어야 겠다 -> **DFS 사용**하자.

### Step0. 입력 및 초기화

```java
class Main {
    static final int MAX = 1000 + 10;
    static boolean[][] graph;
    static boolean[] visited;
    static int N, M;
    static int answer;

    public static void main(String[] args) throws IOException {
      // 0. 입력 및 초기화
      BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
      BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

      StringTokenizer st = new StringTokenizer(br.readLine());
      N = Integer.parseInt(st.nextToken());
      M = Integer.parseInt(st.nextToken());
      ...
    }
}
```

* 이전 [바이러스](https://devfancy.github.io/solved-class3-backjoon-2606/) 문제와 거의 비슷하기 때문에, 비슷한 부분들에 대한 문제풀이는 생략했다.

* N과 M개의 범위를 볼 때, 최대 1000개라고 되어 있어서, `MAX`라는 변수를 선언했고, 1000 + 10개로 초기화했다.

    * `static + final` = "고정된 + 최종적인"의 의미로, **모든 영역에서 고정된 값으로 상수를 선언**하고자 할 때 사용한다. => **불변**의 값을 가진다.

    * `MAX`라는 상수를 graph와 visited를 만들기 위해서 사용할텐데, 넉넉하게 `10`개를 추가했다.

    * **Tip** : 문제를 풀면서 발생하는 시간 낭비와 예외 처리를 한 번에 끝낼 수 있기 때문에, 넉넉하게 `10`개를 추가하자.

* 그리고 입력 부분에서 첫번째 줄에 N, M을 띄어쓰기를 기준으로 구분하기 때문에 `StringTokenizer.nextToken`을 이용하여 값을 저장한다.

### Step1. graph에 연결 정보 채우기

```java
class Main {
    final static int MAX = 1000 + 10;
    static boolean[][] graph;
    static boolean[] visited;
    static int N, M;
    static int answer;

    public static void main(String[] args) throws IOException {
      ...
      // 1. graph에 연결 정보 채우기
      graph = new boolean[MAX][MAX];
      visited = new boolean[MAX];

      int u, v;
      for(int i = 0; i < M; i++) {
        st = new StringTokenizer(br.readLine());
        u = Integer.parseInt(st.nextToken());
        v = Integer.parseInt(st.nextToken());
        graph[u][v] = true;
        graph[v][u] = true;
      }
      ...
    }
}
```

* 위에서 말했던 `MAX`라는 상수를 배열 크기로 graph와 visited를 선언한다.

* 그런 다음, M번만큼 반복문을 돌려서 간선의 양 끝점인 u와 v가 연결된 부분은 `true`로 바꿔준다.

### Step2. dfs(재귀함수 호출)

* [바이러스](https://devfancy.github.io/solved-class3-backjoon-2606/) 문제와 다른 점은, 이 문제는 **모든 요소를 방문할 때까지 반복하는 문제**이므로, 반복문을 선언해줘야 한다.

```java
class Main {
    ...
    static void dfs(int idx) {
      visited[idx] = true;
      for(int i = 1; i <= N; i++) {
        if(visited[i] == false && graph[idx][i]) {
          dfs(i);
        }
      }
    }
    
    public static void main(String[] args) throws IOException {
        ...
        // 2. dfs(재귀함수 호출) - visited가 모두 true일때까지 방문한다.
        for(int i = 1; i <= N; i++) {
          if(visited[i] == false) {
            dfs(i);
            answer++;
          }
        }
        ...
    }
}
```

* 1번부터 N번까지 모든 정점을 방문하기 때문에 1부터 N까지 반복하는 것이고, 한번도 방문하지 않았을 경우에만 dfs를 호출한다.

* dfs 함수에서는 N번만큼 반복문을 돌려서, `한번도 방문하지 않은 경우 && idx 번호와 i번호가 연결된 경우`에만 dfs를 호출하도록 한다.

* 해당 예제 1번에서, 아래와 같이 입력 값을 받을 경우

```
6 5
1 2
2 5
5 1
3 4
4 6
```

![](/assets/img/algorithm/solved-class3-backjoon-11724-1.jpeg)

* 처음에는 1,2,5에서 끝나기 때문에 여기서 연결 요소의 개수가 +1 증가하고

    두번째에는 3,4,6에서 끝나기 때문에 여기서 연결 요소의 개수가 +1 증가하게 된다.

* 그래서 dfs가 끝난 뒤에 +1 증가하므로 dfs 뒤에 `answer++`를 해주는 것이다.

### Step3. 출력하기

```java
class Main {
    ...
    public static void main(String[] args) throws IOException {

      // 3. 출력
      bw.write(String.valueOf(answer));

      bw.close();
      br.close();
    }
}
```

* 출력하기는 연결 요소의 개수, 즉 `answer` 값을 출력하므로 `bw.write(String.valueOf(answer));`을 작성한다.

    여기서 `BufferedWriter`를 통해 **String으로 전달**해줘야 하므로 `String.valueOf()` 함수를 안에 넣은 것이다.

* 그리고 `BufferedReader`, `BufferedWriter` 모두 버퍼를 잡아 놓았기 때문에 반드시 flush() 또는 close()를 호출해서 뒤처리를 해줘야한다.

    `flush()`는 스트림을 비우는 함수이고, `close()`는 스트림을 닫는 함수이다.

    만약 한번 출력후, 다른 것도 출력하고자 한다면 `flush()`를 사용하면 된다.

## Review

* 해당 문제는 이전 [바이러스](https://devfancy.github.io/solved-class3-backjoon-2606/) 문제와 비슷해서, 조금더 빠르게 풀 수 있었다.

* 문제를 풀면서, 입출력에 대한 여러 함수를 배울 수 있어서 좋았다.

