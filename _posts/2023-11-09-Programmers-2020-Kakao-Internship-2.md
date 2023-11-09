---
layout: post
title:  " [Programmers] 수식 최대화(dfs, 순열) "
categories: Algorithm
author: devFancy
---
* content
{:toc}

[문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/67257)

## 성능 요약

* 메모리: 72.3 MB, 시간: 11.40 ms - Answer Code1

* 메모리: 72.8 MB, 시간: 2.81 ms - Answer Code2

## 구분

* 코딩테스트 연습 > 2020 카카오 인턴십 > 수식 최대화

## Answer Code1(23.11.09)

```java
import java.util.*;

class Solution {
    static long answer = 0;
    static String op[] = {"+", "-", "*"};
    static boolean[] visited = new boolean[3];
    static ArrayList<Long> numList = new ArrayList<>(); // 피연산자, 숫자
    static ArrayList<String> opList = new ArrayList<>(); // 연산자
    static String[] perm = new String[3];

    public long solution(String expresstion) {
        String num = "";

        //num op 구분
        for(int i = 0; i < expresstion.length(); i++) {
            char c = expresstion.charAt(i);
            if(c == '*' || c == '+' || c == '-') { // 연산자인 경우
                opList.add(c+"");
                numList.add(Long.parseLong(num));
                num = ""; // num을 초기화합니다. 새로운 피연산자를 시작하기 위해서 num을 비워줍니다.
            } else { // 피연산자인 경우
                num += c;
            }
        }
        // 마지막 숫자
        numList.add(Long.parseLong(num));

        // 순열 만들기
        makePermutation(0);

        return answer;
    }

    static void makePermutation(int depth) {
        if(depth == op.length) {
            // 3개를 선택 -> 연산
            sol();
            return;
        }
        for(int i = 0; i < op.length; i++) {
            if(visited[i]) continue;
            visited[i] = true;
            perm[depth] = op[i];
            makePermutation(depth+1);
            visited[i] = false;
        }
    }

    static void sol() {
        // list 복사
        ArrayList<String> oper = new ArrayList<String>();
        oper.addAll(opList);

        ArrayList<Long> num = new ArrayList<Long>();
        num.addAll(numList);

        // 연산자 우선순위에 따라 계산
        for(int i = 0; i < perm.length; i++) {
            String op = perm[i];
            for(int j = 0; j < oper.size(); j++) {
                if(oper.get(j).equals(op)) {
                    long n1 = num.get(j);
                    long n2 = num.get(j+1);
                    long res = cal(n1, n2, op);

                    // list 갱신
                    num.remove(j+1);
                    num.remove(j);
                    oper.remove(j);

                    num.add(j, res);

                    j--;
                }
            }
        }

        answer = Math.max(answer, Math.abs(num.get(0)));
    }

    static long cal(long n1, long n2, String op) {
        long result = 0;
        switch(op) {
            case "*":
                result = n1 * n2;
                break;
            case "+":
                result = n1 + n2;
                break;
            case "-":
                result = n1 - n2;
                break;
        }
        return result;
    }
}
```

### 문제풀이 - Answer Code1

> [풀이]

1. 먼저 피연산자와 연산자를 분리해서 List에 넣은 후, 모든 연산자의 우선순위 순열에 대해 값을 계산해준다.
2. +, *, -  3가지 연산자에 대해서 가능한 우선순위는 3!=6가지이다. dfs를 통해 이에 대한 순열을 구할 수 있다.
3. 그 후 연산자 우선순위에 따라서 계산해준 후 최대값을 비교해서 얻어낸다.

#### 초기화

```java
class Solution {
		static long answer = 0;
    static String op[] = {"+","-","*"}; // 가능한 연산자
    static boolean[] visited = new boolean[3]; // 연산자들의 사용 여부
    static ArrayList<Long> numList = new ArrayList<>(); // 숫자(피연산자)
    static ArrayList<String> opList = new ArrayList<>(); // 연산자
    static String[] perm = new String[3]; // 순열을 만들기 위한 배열
		// 밑부분 생략
}
```

#### 피연산자와 연산자 분리

```java
//num op 구분
for(int i = 0; i < expression.length(); i++) {
    char c = expression.charAt(i);
    if(c == '*' || c == '+' || c == '-') { // 연산자인 경우
        opList.add(c+"");
        numList.add(Long.parseLong(num));
        num = ""; // num을 초기화합니다. 새로운 피연산자를 시작하기 위해서 num을 비워줍니다.
    } else { // 피연산자인 경우
        num += c;
    }
}
```

연산자인 경우와 피연산자인 경우를 조건문으로 구분했다.

- 연산자인 경우는 문자 변환하여 `opList`에 추가한다.
    - `numList.add(Long.parseLong(num));` 은 지금까지 쌓인 숫자를 `Long` 타입으로 변환하여 `numList`에 추가한다는 의미이다.
    - `num = “”;` 을 한 이유는 새로운 피연산자를 시작하기 위해서 `num`을 비워주는 것을 의미한다.
- 피연산자인 경우는 현재 숫자를 `num`에 더해준다.
    - 이렇게하면 다음 반복문에서 if문에 있는 `numList.add(Long.parseLong(num));` 에서 해당 숫자를 `numList` 에 넣어주게 된다.
- 마지막에 쌓인 숫자를 `Long` 타입으로 변환하여 `numList`에 추가한다.

이 코드는 주어진 수식을 순회하면서 연산자와 피연산자를 구분하여 **`opList`**와 **`numList`**에 저장하는 역할을 한다.

예를 들어, 수식이 "100-200*300-500+20"인 경우에는 **`opList`**에는 ["-", "*", "-", "+"]이 저장되고, **`numList`**에는 [100, 200, 300, 500, 20]이 저장된다.

#### dfs를 통해 순열 처리

```java
static void makePermutation(int depth) {
    if(depth == op.length) {
        // 3개를 선택 -> 연산
        sol();
        return;
    }
    for(int i = 0; i < op.length; i++) {
        if(visited[i]) continue;
        visited[i] = true;
        perm[depth] = op[i];
        makePermutation(depth+1);
        visited[i] = false;
    }
}
```

위 코드는 연산자의 우선순위의 모든 가능한 순열을 생성하는 메서드다. `makePermutation` 메서드는 **재귀적**으로 호출된다.

- if문에서는 현재 순열의 길이가 연산자의 총 개수와 같다면, 즉 모든 연산자에 대한 순열이 만들어진 경우다.
    - 그런 경우 `sol()` 메서드를 호출하여 순열에 대한 연산을 수행한다.
- for문에서는 가능한 모든 연산자를 대상으로 반복문을 실행한다.
    - `visited[i] = true;` 의 경우 현재 연산자 `op[i]`를 사용한다는 의미이다.
    - 그리고 `makePermutation(depth+1);` 을 통해 더 깊은 위치로 재귀 호출을 해서 다음 연산자를 선택한다.
    - `visited[i] = false;` 는 현재 연산자 `op[i]`를 다시 사용하지 않는 상태로 되돌린다.

#### 연산자 우선순위에 따라서 계산해준 후 최대값을 비교

```java
static void sol() {
        // list 복사
        ArrayList<String> oper = new ArrayList<String>();
        oper.addAll(opList);

        ArrayList<Long> num = new ArrayList<Long>();
        num.addAll(numList);

        // 연산자 우선순위에 따라 계산
        for(int i = 0; i < perm.length; i++) {
        String op = perm[i];
        for(int j = 0; j < oper.size(); j++) {
        if(oper.get(j).equals(op)) {
        long n1 = num.get(j);
        long n2 = num.get(j+1);
        long res = cal(n1, n2, op);

        // list 갱신
        num.remove(j+1);
        num.remove(j);
        oper.remove(j);

        num.add(j, res);

        j--;
        }
        }
        }

        answer = Math.max(answer, Math.abs(num.get(0)));
        }

static long cal(long n1, long n2, String op) {
        long result = 0;
        switch(op) {
        case "*":
        result = n1 * n2;
        break;
        case "+":
        result = n1 + n2;
        break;
        case "-":
        result = n1 - n2;
        break;
        }
        return result;
        }
```

`oper`라는 새로운 문자열 리스트를 생성하고, 연산자 리스트의 복사본을 만든다.

`num`이라는 새로운 Long 타입의 리스트를 생성하고 숫자 리스트의 복사본을 만든다.

연산자 우선순위의 모든 경우를 for문을 통해 반복한다.

- 현재 순열에서 선택한 연산자를 `op`에 저장한다.
- 연산자 리스트를 순회하면서 현재 연산자 `op`와 연산자 리스트의 원소가 일치하는 경우, 현재 연산자 앞 뒤에 있는 두 숫자를 `n1`과 `n2`에 저장한다.
- 그런 다음 `cal` 메서드를 호출하여 `n1`과 `n2`를 `op`로 계산한 결과를 `res`에 저장한다.
- 계산에 사용된 두 숫자와 연산리스트를 리스트에서 제거하고 `num.add(j, res);` ****을 통해 계산 결과를 원래 순서에 넣는다.
    - 여기서 `res` 값을 `j` 인덱스 위치에 추가하는 역할을 한다.
    - 예를 들어, `num` 리스트가 [1,2,3,4,5]이고, `j`가 2이고, `res`가 10이라면, 실행 후 `num` 리스트는 [1,2,10,3,4,5]가 된다.
- 리스트에서 요소가 제거되었으므로 `j`를 감소시켜서 다음 순회에 올바른 인덱스가 가리키도록 한다.

`static long cal(long n1, long n2, String op) { ... }`: 주어진 두 숫자와 연산자로 계산을 수행하는 메서드다.

## Answer Code2(23.11.09)

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

class Solution {
    static List<List<String>> list = new ArrayList<>();
    public long solution(String expression) {
        long answer = 0;
        boolean[] visited = new boolean[3];
        String[] operationTypes = {"-","+","*"};
        // 연산자 우선순위 모든 경우의 수 계산
        permutation(new ArrayList<>(), operationTypes, visited);

        // 연산자를 " "로 치환 후 split 값들을 Long 값으로 변환 후 toList
        List<Long> numbers = Arrays.stream(expression.replaceAll("-|\\*|\\+"," ").split(" "))
                .map(Long::parseLong).collect(Collectors.toList());
        // 숫자를 공백으로 치환 후 toList
        List<String> collect = Arrays.stream(expression.replaceAll("[0-9]", "").split(""))
                .collect(Collectors.toList());

        // 우선순위 모든 경우의 수에 따른 max 연산 값
        for (List<String> strings : list) {
            answer = Math.max(answer, solve(strings, numbers, collect));
        }
        return answer;
    }

    static long solve(List<String> strings, List<Long> numbers, List<String> operations) {
        // 리스트에 remove 메서드를 사용하기 위해서 복사
        List<Long> numbersClone = new ArrayList<>(numbers);
        List<String> operationsClone = new ArrayList<>(operations);

        for (int i = 0; i < strings.size(); i++) {
            String operation = strings.get(i); // 현재 순위의 연산자

            for(int j = 0; j < operationsClone.size(); j++) {
                // 현재 순위의 연산자와 같은 경우
                if(operation.equals(operationsClone.get(j))) {
                    // 연산자 앞의 수와 뒤의 수를 구한뒤 연산
                    long front = numbersClone.get(j);
                    long back = numbersClone.get(j + 1);
                    long temp = calc(front, back, operation);

                    // 연산에 사용된 두수를 제거
                    numbersClone.remove(j+1);
                    numbersClone.remove(j);

                    // 연산에 사용된 연산자 제거
                    operationsClone.remove(j);

                    // 연산된 값을 추가
                    numbersClone.add(j, temp);

                    // 연산이 진행되는 경우 2개 -> 1개 가되므로 리스트의 사이즈에 변경이 일어남
                    // 이를 맞추기 위해서 j를 --하여 다움 for문에서 범위를 벗어나지 않게 함
                    j--;
                }
            }
        }
        // 절대값으로 변환해서 리턴
        return Math.abs(numbersClone.get(0));
    }

    static void permutation(ArrayList<String> arrayList, String[] orders, boolean[] visited) {
        if(arrayList.size() == 3) {
            list.add(arrayList);
            return;
        }

        for (int i = 0; i < orders.length; i++) {
            if (!visited[i]) {
                ArrayList<String> temp = new ArrayList<>(arrayList);
                temp.add(orders[i]);
                visited[i] = true;
                permutation(temp, orders, visited);
                visited[i] = false;
            }
        }
    }

    static long calc(long one, long two, String calc) {
        switch (calc) {
            case "-" :
                return one - two;
            case "+" :
                return one + two;
            default :
                return one * two;
        }
    }
}
```

## Review

* 해당 문제를 어떻게 접근해야 할지 감이 오질 않아서 다른 사람의 풀이를 참고했고, 해당 코드를 이해하느라 시간이 오래걸렸다.

* 순열과 dfs을 이용하여 문제를 풀었는데, 해당 코드를 이해하는데도 어려워서 해당 문제는 여러 번 복습해야겠다는 생각이 들었다.

* 두번째 정답은 첫번째에 비해 성능적으로 5배나 좋게 되어있어서 다음에 기회되면 두번째 풀이방식으로도 접근해야겠다.

## Reference

* https://stritegdc.tistory.com/232 - Answer Code1