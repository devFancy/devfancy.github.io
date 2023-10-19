---
layout: post
title: " 실전! 스프링 부트와 JPA 활용2: API 개발 고급 - 지연 로딩과 조회 성능 최적화 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [실전! 스프링 부트와 JPA 활용 2] 강의를 들으며 정릐한 내용을 토대로 작성하였습니다.

## API 개발 고급

주문 + 배송정보 + 회원을 조회하는 API를 만들면서 지연 로딩 때문에 발생하는 성능 문제를 단계적으로 해결하는 과정을 정리하고자 합니다.

## 간단한 주문 조회 V1: 엔티티를 직접 노출

OrderSimpleApiController

```java
package jpabook.jpashop.api;
/**
 * xToOne(ManyToOne, OneToOne) - 성능 최적화
 * Order
 * Order -> Member
 * Order -> Delivery
 */
@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {

    private final OrderRepository orderRepository;

    /**
     * V1. 엔티티 직접 노출
     * - Hibernate5Module 모듈 등록, LAZY=null 처리 * - 양방향 관계 문제 발생 -> @JsonIgnore
     */
    
    @GetMapping("/api/v1/simple-orders")
    public List<Order> ordersV1() {
        List<Order> all = orderRepository.findAllByString(new OrderSearch());
        for (Order order : all) {
            order.getMember().getName();
            order.getDelivery().getAddress();
        }
        return all;
    }
}
```

* 엔티티를 직접 노출하는 것은 좋지 않다. (이러한 이유에 대해서는 [이전글](https://devfancy.github.io/SpringBoot-JPA2-basic/)에서 이미 설명했음)

* `order` -> `member`, `order` -> `delivery`는 지연 로딩으로 실제 엔티티 대신에 프록시가 존재하게 된다.

    * (참고로, `Order` - `Member` 엔티티는 다대일 관계, `Order`와 `Delivery`는 일대일 관계)

* jackson 라이브러리는 기본적이로 이 프록시 객체를 json으로 어떻게 생성하는지 모르기 때문에 예외가 발생한다.

    * 예외 내용: `No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$5vbd87AL["hibernateLazyInitializer"])`

* 따라서 `Hibernate5Module`을 스프링 빈으로 등록하면 해결된다.

    * 스프링 부트 3.0 미만인 경우 `build.gradle` 에서 다음 라이브러리를 추가한다.
    * `implementation 'com.fasterxml.jackson.datatype:jackson-datatype-hibernate5'`

* 그런 다음, `JpashopApplication` 에 다음 코드를 추가해준다.

```java
@SpringBootApplication
public class JpashopApplication {

	public static void main(String[] args) {
		SpringApplication.run(JpashopApplication.class, args);
	}

	@Bean
	Hibernate5Module hibernate5Module() {
		Hibernate5Module hibernate5Module = new Hibernate5Module();
		//강제 지연 로딩 설정 (사실 아래에 있는 건 쓰면 안됨)
		hibernate5Module.configure(Hibernate5Module.Feature.FORCE_LAZY_LOADING,true);
		return hibernate5Module;
	}
}
```

* 이 옵션을 키면, 양방향 연관관계(order -> member, member -> orders)로 계속 로딩하게 된다. 따라서 `@JsonIgnore` 옵션을 두개의 엔티티중 한곳에 주어야 한다.

정리: 해당 방법은 강제로 지연 로딩을 설정해서 에러를 해결했으나, 이전에 말했듯이 엔티티를 API 응답으로 외부로 노출하는 것은 좋지 않다. 따라서 `Hibernate5Module`를 사용하기 보다는 **`DTO`로 변환해서 하는 것**이 좋은 방법이다.

## 간단한 주문 조회 V2: 엔티티를 DTO로 변환

OrderSimpleApiController - 추가

```java
package jpabook.jpashop.api;

@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v2/simple-orders")
    public List<SimpleOrderDto> ordersV2() {
        // ORDER 2개
        // N + 1 -> 1 + N(2): 첫번째 쿼리의 결과로 n번만큼 query가 추가 실행되는 게 N + 1이라는 의미임.
        // N + 1 -> 1 + 회원 N + 배송 N
        List<Order> orders = orderRepository.findAllByString(new OrderSearch());

        List<SimpleOrderDto> result = orders
                .stream()
                .map(o -> new SimpleOrderDto(o))
                .collect(Collectors.toList());

        return result;
    }

    @Data
    static class SimpleOrderDto {
        private Long orderId;
        private String name;
        private LocalDateTime orderDate;
        private OrderStatus orderStatus;
        private Address address;

        public SimpleOrderDto(Order order) {
            orderId = order.getId();
            name = order.getMember().getName(); // LAZY 초기화
            orderDate = order.getOrderDate();
            orderStatus = order.getStatus();
            address = order.getDelivery().getAddress();  // LAZY 초기화
        }
    }
}
```

* V1과 다르게 V2에서는 엔티티를 DTO로 변환한 일반적인 방법이다.

* 하지만 V2에서는 실제 쿼리를 실행했을 때 `N+1` 문제가 생긴다.

    * 현재 로직상 `order`와 연관된 `member`와 `delivery`에서 지연 로딩으로 인해 조회가 N번 실행된다.

    * 그래서 쿼리가 총 `1 + N + N`번 실행된다. (이는 V1에서의 쿼리 수 결과와 같다)

    * 자세하게 설명하면, `order` 조회에서 1번, `order -> member` 지연 로딩 조회에서 N번, `order -> delivery` 지연 로딩 조회에서 N번이 실행된다.

    * 만약 같은 회원이였으면 N번이 아닌 1번인데, 서로 다른 회원이므로 N번이 된 것이다.

    * 지연로딩은 영속성 컨텍스트에서 조회하므로, 이미 조회된 경우 쿼리를 생략한다.

* 따라서 이러한 `N+1` 문제를 해결하기 위해 **페치 조인**(fetch join)을 통해 성능을 최적화하는 방법을 사용한다.

## 간단한 주문 조회 V3: 엔티티를 DTO로 변환 - 페치 조인 최적화

OrderSimpleApiController - 추가

```java
package jpabook.jpashop.api;

@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {

    private final OrderRepository orderRepository;

    @GetMapping("/api/v3/simple-orders")
    public List<SimpleOrderDto> ordersV3() {
        List<Order> orders = orderRepository.findAllWithMemberDelivery();

        List<SimpleOrderDto> result = orders.stream()
                .map(o -> new SimpleOrderDto(o))
                .collect(Collectors.toList());
        return result;
    }
}
```

OrderRepository - 추가 코드

```java
@Repository
@RequiredArgsConstructor
public class OrderRepository {

    private final EntityManager em;

    // 재사용성 O
    public List<Order> findAllWithMemberDelivery() {
        return em.createQuery(
                "select o from Order o" +
                        " join fetch o.member m" +
                        " join fetch o.delivery d", Order.class
        ).getResultList();
    }
}
```

* 엔티티를 페치 조인(fetch join)을 사용해서 5번이였던 쿼리를 1번만 조회할 수 있는 효과를 볼 수 있다.

* 페치 조인으로 인해 `order -> member`, `order -> delivery`는 이미 조회된 상태이므로 지연로딩이 되지 않는다.

* 실제 쿼리를 돌려보면 아래와 같이 조회 결과가 나오게 된다.

```sql
select
        order0_.order_id as order_id1_6_0_,
        member1_.member_id as member_i1_4_1_,
        delivery2_.delivery_id as delivery1_2_2_,
        order0_.delivery_id as delivery4_6_0_,
        order0_.member_id as member_i5_6_0_,
        order0_.order_date as order_da2_6_0_,
        order0_.status as status3_6_0_,
        member1_.city as city2_4_1_,
        member1_.street as street3_4_1_,
        member1_.zipcode as zipcode4_4_1_,
        member1_.name as name5_4_1_,
        delivery2_.city as city2_2_2_,
        delivery2_.street as street3_2_2_,
        delivery2_.zipcode as zipcode4_2_2_,
        delivery2_.status as status5_2_2_ 
    from
        orders order0_ 
    inner join
        member member1_ 
            on order0_.member_id=member1_.member_id 
    inner join
        delivery delivery2_ 
            on order0_.delivery_id=delivery2_.delivery_id
2023-10-19 14:56:18.992  INFO 48324 --- [nio-8080-exec-5] p6spy                                    : #1697694978992 | took 0ms | statement | connection 9| url jdbc:h2:tcp://localhost/~/jpashop
select order0_.order_id as order_id1_6_0_, member1_.member_id as member_i1_4_1_, delivery2_.delivery_id as delivery1_2_2_, order0_.delivery_id as delivery4_6_0_, order0_.member_id as member_i5_6_0_, order0_.order_date as order_da2_6_0_, order0_.status as status3_6_0_, member1_.city as city2_4_1_, member1_.street as street3_4_1_, member1_.zipcode as zipcode4_4_1_, member1_.name as name5_4_1_, delivery2_.city as city2_2_2_, delivery2_.street as street3_2_2_, delivery2_.zipcode as zipcode4_2_2_, delivery2_.status as status5_2_2_ from orders order0_ inner join member member1_ on order0_.member_id=member1_.member_id inner join delivery delivery2_ on order0_.delivery_id=delivery2_.delivery_id
select order0_.order_id as order_id1_6_0_, member1_.member_id as member_i1_4_1_, delivery2_.delivery_id as delivery1_2_2_, order0_.delivery_id as delivery4_6_0_, order0_.member_id as member_i5_6_0_, order0_.order_date as order_da2_6_0_, order0_.status as status3_6_0_, member1_.city as city2_4_1_, member1_.street as street3_4_1_, member1_.zipcode as zipcode4_4_1_, member1_.name as name5_4_1_, delivery2_.city as city2_2_2_, delivery2_.street as street3_2_2_, delivery2_.zipcode as zipcode4_2_2_, delivery2_.status as status5_2_2_ from orders order0_ inner join member member1_ on order0_.member_id=member1_.member_id inner join delivery delivery2_ on order0_.delivery_id=delivery2_.delivery_id;
```

## 간단한 주문 조회 V4: JPA에서 DTO로 바로 조회

OrderSimpleApiController - 추가

```java
@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {

    private final OrderRepository orderRepository;
    private final OrderSimpleQueryRepository orderSimpleQueryRepository; // 의존관계 주입(V4)

    @GetMapping("/api/v4/simple-orders")
    public List<OrderSimpleQueryDto> ordersV4() {
        return orderSimpleQueryRepository.findOrderDto();
    }
}
```

OrderSimpleQueryRepository 조회 전용 리포지토리

```java
package jpabook.jpashop.repository.order.simplequery;

/**
 * 성능 최적화 관련 레포지토리 경우
 * 따로 패키지를 만들어서 그 안에 관련 클래스를 만든다.
 */
@Repository
@RequiredArgsConstructor
public class OrderSimpleQueryRepository {

    private final EntityManager em;

    // 재사용 X, 유지보수성 O
    // 이런 식으로 성능 최적화에 대한 것은 따로 패키지를 분리하는 것을 권장함
    public List<OrderSimpleQueryDto> findOrderDto() {
        return em.createQuery(
                        "select new jpabook.jpashop.repository.order.simplequery.OrderSimpleQueryDto(o.id, m.name, o.orderDate, o.status, d.address)" +
                                " from Order o" +
                                " join o.member m" +
                                " join o.delivery d", OrderSimpleQueryDto.class)
                .getResultList();
    }
}
```

OrderSimpleQueryDto 리포지토리에서 DTO 직접 조회

```java
package jpabook.jpashop.repository.order.simplequery;

@Data
public class OrderSimpleQueryDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    public OrderSimpleQueryDto(Long orderId, String name, LocalDateTime orderDate, OrderStatus orderStatus, Address address) {
        this. orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }
}
```

* 일반적인 SQL을 사용할 때 처럼 원하는 값을 선택해서 조회하는 방법이다.

* `new` 명령어를 사용해서 JPQL의 결과를 DTO로 즉시 반환한다.

* SELECT 절에서 원하는 데이터를 직접 선택하므로 DB 면에서 에플리케이션 네트워트 용량을 최적화할 수 있지만 생각보다 미비하다.

* 실제 쿼리를 돌려보면 아래와 같이 조회 결과가 나오게 된다.

```sql
select
        order0_.order_id as col_0_0_,
        member1_.name as col_1_0_,
        order0_.order_date as col_2_0_,
        order0_.status as col_3_0_,
        delivery2_.city as col_4_0_,
        delivery2_.street as col_4_1_,
        delivery2_.zipcode as col_4_2_ 
    from
        orders order0_ 
    inner join
        member member1_ 
            on order0_.member_id=member1_.member_id 
    inner join
        delivery delivery2_ 
            on order0_.delivery_id=delivery2_.delivery_id
2023-10-19 15:28:50.970  INFO 48765 --- [nio-8080-exec-3] p6spy                                    : #1697696930970 | took 0ms | statement | connection 7| url jdbc:h2:tcp://localhost/~/jpashop
select order0_.order_id as col_0_0_, member1_.name as col_1_0_, order0_.order_date as col_2_0_, order0_.status as col_3_0_, delivery2_.city as col_4_0_, delivery2_.street as col_4_1_, delivery2_.zipcode as col_4_2_ from orders order0_ inner join member member1_ on order0_.member_id=member1_.member_id inner join delivery delivery2_ on order0_.delivery_id=delivery2_.delivery_id
select order0_.order_id as col_0_0_, member1_.name as col_1_0_, order0_.order_date as col_2_0_, order0_.status as col_3_0_, delivery2_.city as col_4_0_, delivery2_.street as col_4_1_, delivery2_.zipcode as col_4_2_ from orders order0_ inner join member member1_ on order0_.member_id=member1_.member_id inner join delivery delivery2_ on order0_.delivery_id=delivery2_.delivery_id;
```

* 사실 V3와 V4간의 성능 차이가 크게 나진 않는다.

    * V4의 경우, DTO에 직접 조회하기 때문에 리포지토리 재사용성이 떨어지고, API 스펙에 맞춘 코드가 리포지토리에 들어가는 단점이 존재한다.

    * 반면에 V3의 경우, 엔티티로 조회해서 리포지토리 재사용성이 좋고 개발도 단순하다.

* 엔티티를 DTO로 변환하거나(V3), DTO로 바로 조회하는(V4) 두 가지 방법이 각각 장단점이 존재하기 때문에, 아래와 같은 **쿼리 방식을 선택할 때 권장하는 순서**를 정리했다.

> 쿼리 방식 선택 권장 순서

1. 우선 엔티티 -> DTO로 변환하여 API 기능 개발한다. => 필수, V2
2. 필요하면 **페치 조인**(fetch join)으로 성능을 최적화한다. (대부분의 성능 이슈가 90% 해결된다) => V3
3. 그래도 안되면 DTO로 직접 조회하는 방법을 사용한다 => V4
4. 최후의 방법은 JPA가 제공하는 네이티브 SQL이나 스프링 JDBC Template을 사용해서 SQL을 직접 사용한다.

(4번의 경우, 이 강의에서는 다루지 않아서 추후 실제 개발하면서 문제가 생기는 경우, 그때 가서 다시 정리할 예정이다)

## Review

조회하는 부분에서 쿼리를 실행했을 때 `N+1` 문제가 발생하는 점과 그러한 문제를 페치 조인(fetch join)으로 해결하는 방법도 알게되었다.

현재 혹은 미래에 내가 진행하는 프로젝트에서 위와 비슷한 문제가 생겼을 때, **페치 조인**(fetch join으로 성능을 최적화하는 걸 적용해보도록 하자.

(해당 강의에서는 예시로 만든 자료이고, 예시에 있는 데이터가 적기도 해서 최적화하는 방법이 간단했지만, 실제 업무에서는 최적화를 적용하기가 어려울 것이라 생각한다)

## Reference

* [실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - API 개발 기본](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94/dashboard)