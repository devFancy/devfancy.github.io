---
layout: post
title: " [SpringBoot] 변경 감지와 병합(merge) "
categories: SpringBoot
author: fancy96
---
* content
{:toc}

> 이 글의 코드와 정보들은 [실전! 스프링 부트와 JPA 활용 1] 강의를 들으며 정리한 내용을 토대로 작성하였습니다..


## 준영속 엔티티

* `준영속 엔티티`란 영속성 컨텍스트가 더는 관리하지 엔티티를 말한다.

* `itemController` 에서 updateItem 클래스로 예시를 들자면,

* 기존의 데이터를 업데이트를 하려고 하는데, 이미 데이터들이 세팅되어있는 경우다. (setId, setName, setPrice, ...)

* 이 말의 의미는 이미 한번 JPA(DB)에 들어갔다 나온 데이터라는 의미다. (JPA가 식별할 수 있는 ID를 가지고 있다)

* 이렇게 임의로 만들어낸 엔티티도 **기존 식별자**를 가지고 있기 때문에 준영속 엔티티로 볼 수 있다.

* 아래의 예시에서 `Book` 객체가  `준영속 상태 객체`라고 한다.

```java
@Controller
@RequiredArgsConstructor
public class ItemController {
    
    @PostMapping("/items/{itemId}/edit")
    public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form) {

        Book book = new Book();
        book.setId(form.getId());
        book.setName(form.getName());
        book.setPrice(form.getPrice());
        book.setStockQuantity(form.getStockQuantity());
        book.setAuthor(form.getAuthor());
        book.setIsbn(form.getIsbn());

        itemService.saveItem(book);
        return "redirect:/items";
    }
}
```

* 여기서는 내가 직접 `new` 로 해서 만든 객체이므로 JPA가 기본적으로 관리하지 않는다.

* 아무리 여기서 값을 변경한다고 해도,(book.set@@@) DB에 업데이트가 일어나지 않는다.

* 그러면 이런 준영속성 엔티티의 데이터를 어떻게 변경(수정)할 수 있을까?

## 준영속 엔티티를 수정하는 2가지 방법

1. 변경 감지 기능 사용
2. 병합(`merge`) 사용

### 변경 감지 기능 사용

* 첫 번째 방법은 **영속성 컨텍스트에서 엔티티를 다시 조회한 후에 데이터를 수정**한다.

* 영속성 상태인 `findItem`을 사용하고, 값을 세팅하면 Spring에서 `@Transactional`에 의해 트랜잭션이 커밋이 된다.

* 트랜잭션 커밋 시점에 변경을 감지한다. (= **Dirty Checking**)

* 그러면 JPA에서 **Flush**를 날린다. 즉, 영속성 컨텍스트 중에서 변경된 영속성 컨텍스트의 내용을 DB에 반영하는 것을 말한다.

* 쉽게 말해 영속성 컨텍스트의 변경 사항들과 DB의 상태를 맞추는 작업을 한다.(**UPDATE SQL 실행**)

```java
public class ItemService {
    
    @Transactional
    public Item updateItem(Long itemId, Book param) {
        Item findItem = itemRepository.findOne(itemId);
        findItem.setPrice(param.getPrice());
        findItem.setName(param.getName());
        findItem.setStockQuantity(param.getStockQuantity());
        findItem.setCategories(param.getCategories());
        findItem.setPrice(param.getPrice());

        return findItem;
    }
}
```

### 병합(`merge`) 사용

* 두 번째 방법은 병합을 사용하는 것이다. `병합`이란 **준영속성 상태의 엔티티를 영속 상태로 변경할 때 사용하는 기능**이다.


![]()

> 병합 동작 방식(디테일한 설명)

1. merge()를 실행(호출)한다.

2. 파라미터로 넘어온 준영속 엔티티의 식별자 값으로 1차 캐시에서 엔티티를 조회한다.

    2-1. 만약 1차 캐시에 엔티티가 없으면 DB에서 엔티티를 조회하고, 1차 캐시에 저장한다.

3. 조회한 영속 엔티티(`mergeMember`)에 `member` 엔티티의 값을 채워 넣는다. (member 엔티티의 모든 값을 mergeMember에 밀어 넣는다. 이때 mergeMember의 "회원1"이라는 이름이 "회원명변경"으로 바뀐다.)

4. 영속 상태인 mergeMember를 반환한다.


> 병합 시 동작 방식(간단히 정리)

1. 준영속성 엔티티의 식별자 값으로 영속 엔티티를 조회한다.

2. 영속 엔티티의 값을 준영속 엔티티의 값으로 모두 교체한다.(병합)

3. 트랜잭션 커밋 시점에 변경 감지 기능이 동적해서 데이터베이스에 `UPDATE SQL`이 실행된다.


### 병합시 단점

* [1] 변경 감지 기능을 사용하면 **원하는 속성만 선택해서 변경**할 수 있다.

* 하지만, [2] 병합을 사용하면 **모든 속성이 변경**되므로 만약에 병합시 값이 없으면 `null`로 업데이트되는 위험이 있다.

* 실무에서는 변경 가능한 데이터만 노출하므로 병합을 사용하는 것이 오히려 번거롭다.

### 가장 좋은 해결 방법 

* 병합은 모든 필드를 교체하는 위험이 있으므로 **엔티티를 변경할 때는 항상 `변경 감지` 방법을 사용**하는 것이 좋다. (실무에서도 마찬가지)

  * 실무에서는 가급적 엔티티를 건드리면 안되기 때문에 `.setPrice`와 같은 Setter 방식으로 개발하면 안되고, `change()`와 같은 의미있는, 바로 추적할 수 있는 메서드를 사용해야 한다.

* 컨트롤러에서 엔티티를 생성하는 것보다 트랜잭션이 있는 서비스 계층에서 식별자(`id`)와 변경할 테이터를 **`파라미터` 혹은 `dto`로 생성**해서 명확하게 전달하는 것이 좋다.

* 트랜잭션이 있는 서비스 계층에서 영속 상태의 엔티티를 조회하고, 엔티티의 데이터를 직접 변경한다.

* 그러면 트랜잭션 커밋 시점에 변경 감지가 실행된다.


* 아래 예시에서는 트랜잭션이 있는 서비스 계층에서 **식별자와 변경할 데이터를 파라미터로 생성해서 전달** 하는 방식으로 구현했다.

> ItemController 

```java
@Controller
@RequiredArgsConstructor
public class ItemController {
    /**
     * 상품 수정, 권장 코드
     */
    @PostMapping("/items/{itemId}/edit")
    public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form) {

        /*
        Book book = new Book();
        book.setId(form.getId());
        book.setName(form.getName());
        book.setPrice(form.getPrice());
        book.setStockQuantity(form.getStockQuantity());
        book.setAuthor(form.getAuthor());
        book.setIsbn(form.getIsbn());

        itemService.saveItem(book);
        */

        itemService.updateItem(itemId, form.getName(), form.getPrice(), form.getStockQuantity());
        return "redirect:/items";
    }
}
```

> ItemService

```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ItemService {
    /**
     * 영속성 컨텍스트가 자동 변경
     */
    @Transactional
    public void updateItem(Long id, String name, int price, int stockQuantity) {
        Item findItem = itemRepository.findOne(id);
        findItem.setName(name);
        findItem.setPrice(price);
        findItem.setStockQuantity(stockQuantity);
    }
}
```

## Reference

* [실전! 스프링 부트와 JPA 활용 1](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1/)

* [자바 ORM 표준 JPA 프로그래밍 - 3.6.5](http://www.yes24.com/Product/Goods/19040233)