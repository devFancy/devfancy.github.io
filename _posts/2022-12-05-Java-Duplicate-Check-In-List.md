---
layout: post
title:  " 리스트 내 요소 중복 체크(유효성 검사) "
categories: Java
author: devFancy
---
* content
{:toc}

[숫자 야구 게임](https://github.com/devFancy/java-baseball/tree/fancy-review)

* 해당 미션에서 예외 처리 목록에서 서로 다른 숫자가 아닌 경우 예외 처리를 해줘야만 했다.

---

## Set 이용

* Set : 중복을 허용하지 않은 자료구조이다.

* 리스트를 Set으로 변환해서 크기를 비교한다.

* 크기가 달라졌으면 리스트에 중복된 요소가 있었다는 것을 의미한다.

``` java
@DisplayName("중복인지 확인")
@Test
void DuplicateTest() {
    List<Integer> userDuplicate = Arrays.asList(1,1,2,3,4,5);
    // Set 으로 변환
    Set<Integer> userNoDuplicate = new HashSet<>(userDuplicate);
    if(userNoDuplicate.size() != userDuplicate.size()) {
        System.out.println("중복된 요소가 있습니다.");
        System.out.println("전체 개수는 " + userDuplicate.size()); // 6개
        System.out.println("중복되지 않은 개수는 " + userNoDuplicate.size()); // 5개
    }
}
```


## 구현한 코드

구현한 코드 주소 : [java-baseball-review](https://github.com/devfancy/java-baseball)

``` java
public void validateNumberRange(List<Integer> user) {
    Set<Integer> userNoDuplicate = new HashSet<>(user);
    if(userNoDuplicate.size() != user.size()) {
        throw new IllegalArgumentException(ERROR_MESSAGE + "서로 다른 3자리 숫자만 입력 가능합니다.");
    }
    if(!isCorrectForm(userNoDuplicate)) {
        throw new IllegalArgumentException(ERROR_MESSAGE + "0이 아닌 3자리 숫자만 입력 가능합니다.");
    }
}
public boolean isCorrectForm(Set<Integer> userNoDuplicate) {
    if (userNoDuplicate.size() == BASEBALL_LENGTH && !userNoDuplicate.contains(ZERO)) {
        return true;
    }
    return false;
}
```

* List로 받아온 user를 Set으로 변환한 userNoDuplicate와 .size()로 비교해서 같지 않으면 중복이므로, IllegalArgumentException()로 예외를 발생시킨다.

---

## Stream.distinct() 이용

* Stream.distinct()은 stream의 중복을 모두 제거한다.

* Stream.count()는 stream의 사이즈를 리턴한다.

* 기존의 리스트 크기와 Stream.distinct().count()가 다르다면 리스트에 중복된 요소가 있었다는 것을 의미한다.

``` java
public static void main(String[] args) {

    List<Integer> numList = Arrays.asList(1,1,2,3,4,5);
    if(numList.size() != numList.stream().distinct().count()){
        System.out.println("중복된 요소가 있습니다.");
    }
}
```