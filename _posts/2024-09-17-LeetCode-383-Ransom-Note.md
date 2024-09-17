---
layout: post
title: " 383. Ransom Note "
categories: LeetCode
author: devFancy
---
* content
{:toc}

## Problem

* https://leetcode.com/problems/ransom-note/

* 주어진 ransomNote가 magazine의 글자를 이용하여 만들어질 수 있는지 확인하는 문제이다.

    * 매거진에 있는 각 문자는 한 번만 사용할 수 있기 때문에 

    * ransomNote의 각 문자를 **magazine에서 충분히 가져올 수 있는지 검사하는 것이 핵심**이다.

## Answer 1

```java
class Solution {
  public boolean canConstruct(String ransomNote, String magazine) {

    HashMap<Character, Integer> map = new HashMap<>();

    int len = magazine.length();

    for(int i = 0; i < len; i++) {
      char current = magazine.charAt(i);
      map.put(current, map.getOrDefault(current, 0) + 1);
    }

    len = ransomNote.length();

    for(int i = 0; i < len; i++) {
      char key = ransomNote.charAt(i);
      if(map.get(key) != null && map.get(key) > 0) {
        map.put(key, map.get(key) - 1);
      } else {
        return false;
      }
    }
    return true;
  }
}
```

### Solution

* 이 코드는 매거진과 ransomNote의 길이를 각각 한 번씩 순회하며 

* 각 문자의 개수를 세고 비교하므로 시간 복잡도는 **O(m + n)** (m: 매거진의 길이, n: 랜섬노트의 길이) 이다.

> [1] 매거진의 문자 개수 세기

```java
class Solution {
  public boolean canConstruct(String ransomNote, String magazine) {
      // ...
      HashMap<Character, Integer> map = new HashMap<>();

      int len = magazine.length();

      for (int i = 0; i < magazine.length(); i++) {
          char current = magazine.charAt(i);
          map.put(current, map.getOrDefault(current, 0) + 1);
      }
      // ...
  }
}
```

* 여기서 HashMap을 사용하여 매거진에 등장하는 각 문자의 개수를 기록한다.

* `map.getOrDefault(current, 0) + 1`은 현재 문자가 map에 이미 존재하면 그 값을 1 증가시키고, 그렇지 않으면 0을 기본값으로 설정하여 1로 초기화한다.

> [2] ransomNote에서 각 문자를 매거진에서 찾기

```java
class Solution {
  public boolean canConstruct(String ransomNote, String magazine) {
      
    // ...
    len = ransomNote.length();
    
    for(int i = 0; i < ransomNote.length(); i++) {
      char key = ransomNote.charAt(i);
      if(map.get(key) != null && map.get(key) > 0) {
        map.put(key, map.get(key) - 1);
      } else {
        return false;
      }
    }
    // ...
    
  }
}
```

* 이 반복문에서는 ransomNote에 있는 각 문자를 하나씩 확인한다.

* `map.get(key) != null && map.get(key) > 0`은 매거진에 해당 문자가 존재하고, 아직 사용 가능한 문자의 개수가 남아 있는지 확인한다.

* 해당 문자가 매거진에 있다면 `map.put(key, map.get(key) - 1)`로 해당 문자의 개수를 1 감소한다.

* 만약 문자가 더 이상 없거나 매거진에 존재하지 않으면 즉시 `false`를 반환하여 ransomNote를 만들 수 없음을 알린다.

## Answer 2

```java
import java.util.HashMap;

class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // 1. HashMap을 이용해 magazine의 각 문자의 개수 기록
        HashMap<Character, Integer> map = new HashMap<>();
        
        for (int i = 0; i < magazine.length(); i++) {
            char current = magazine.charAt(i);
            map.put(current, map.getOrDefault(current, 0) + 1);
        }
        
        // 2. ransomNote의 각 문자를 검사
        for (int i = 0; i < ransomNote.length(); i++) {
            char current = ransomNote.charAt(i);
            
            // map에 문자가 없거나, 개수가 부족하면 false 반환
            if (!map.containsKey(current) || map.get(current) == 0) {
                return false;
            }
            
            // 사용한 문자의 개수를 줄임
            map.put(current, map.get(current) - 1);
        }
        
        // 3. 모든 문자를 확인한 후 true 반환
        return true;
    }
}
```

### Solution

* [1] magazine의 문자와 등장 횟수를 HashMap에 기록

    * 매거진의 각 문자를 순회하면서, 각각의 문자가 몇 번 등장하는지를 HashMap에 기록한다.

    * 이때, charAt() 메서드를 사용하여 magazine의 각 문자에 접근한다.

* [2] ransomNote의 각 문자를 HashMap에서 확인

    * ransomNote의 각 문자를 확인하며, 그 문자가 HashMap에서 충분히 있는지 확인한다.

    * HashMap에서 문자가 있는지 확인하고, 있다면 그 문자의 개수를 줄여준다.

    * 만약 문자가 없거나 충분하지 않다면, 바로 false를 반환한다.

## Review

* HashMap의 개념과 문법을 알아야 문제를 쉽게 풀 수 있다.

* 첫 번째 풀이가 Runtime 시간이 10ms로 두 번째 풀이보다 **6ms** 더 빠르다.

  * 주로 조건문에서의 효율성 차이와 메소드 호출 방식에서 확인할 수 있다. => `if(map.get(key) != null && map.get(key) > 0)`