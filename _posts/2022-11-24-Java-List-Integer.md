---
layout: post
title:  " String을 List<Integer>로 변환하는 방법 "
categories: Java
author: devFancy
---
* content
{:toc}


## 숫자 야구 게임

* [숫자 야구 게임](https://github.com/Fancy96/java-baseball)

서로 다른 3자리 숫자를 String으로 입력받은 변수 number을 ArrayList<>()로 선언한 List<Integer> user로 옮기는 방법

String → List<Integer> 로 변환하는 방법

### 방법1

```java
public class StringToListInteger{
    List<Integer> user = mappingToList(number);
    
    public List<Integer> mappingToList(String input) {
            List<Integer> userNumber = new ArrayList<>();
            for(int index = 0; index < input.length(); index++) {
                int digit = strToInt(input, index);
                userNumber.add(digit);
            }
            return userNumber;
        }
    
    public int strToInt(String input, int index) {
            char c = input.charAt(index);
            int value = Character.getNumericValue(c);
            return value;
        }
    }
```

* charAt : 문자열 한글자씩 출력

* getNumericValue: 숫자 형태의 char형을 int형으로 변환

### 방법2

```java
public class CharToInteger {
    private List<Integer> transformInputNumbers(String input) {
        ArrayList<Integer> transformNumbers = new ArrayList<>();
        for (char number : input.toCharArray()) {
            transformNumbers.add(Character.getNumericValue(number));
        }
        return transformNumbers;
    }
}
```

### 방법3

“,”를 구분지어서 만들라고 한다면 ?

String input → List<String> → List<Integer>로 변환하는 방법

```java
public class StringToListInteger {
    List<Integer> winningNumberList;

    private void gameStart() {
        String winningNumber = inputView.readInputWinningNumber();
        List<String> winningNumbers = List.of(winningNumber.split(","));
        for (String str : winningNumbers) {
            winningNumberList.add(Integer.parseInt(str));
        }
    }
}
```
