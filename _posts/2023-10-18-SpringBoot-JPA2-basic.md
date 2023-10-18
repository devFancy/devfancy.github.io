---
layout: post
title: " 실전!스프링 부트와 JPA 활용2 - API 개발 기본 "
categories: SpringBoot
author: devFancy
---
* content
{:toc}

> 이 글의 코드와 정보들은 [실전! 스프링 부트와 JPA 활용 2] 강의를 들으며 정릐한 내용을 토대로 작성하였습니다.

## API 개발 기본

* 실무에서는 하나의 도메인에 대한 엔티티를 만들고(ex. 회원), 해당 엔티티를 위한 API가 다양하게 만들어지는데, 한 엔티티에 각각의 API를 위한 모든 요구사항을 담기 어렵다.

* 그리고 엔티티가 변경되면 API 스펙이 변한다.

* 결론: 그렇기 때문에 API 기능 요구사항에 맞춰서 엔티티가 아닌 별도의 `DTO`를 생성하여 파라미터로 받아야 한다.

### 안 좋은 예시

> 참고로, 원래라면 DTO도 클래스로 생성해야 하지만, 여기서는 `이해`를 우선시하기 때문에 Controller 클래스안에 DTO에 대한 코드도 담겨있다는 걸 참고하길 바란다.

V1의 경우, 엔티티를 생성해서 회원에 대한 등록 API를 기능 구현한 예시다.

```java
package jpabook.jpashop.api;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
    public class MemberApiController {

    private final MemberService memberService;
    
    // 실제 애플리케이션에서는 엔티티를 직접 반환해서는 안된다.
    @PostMapping("/api/v1/members")
    public CreateMemberResponse saveMemberV1(@RequestBody @Valid Member member) {
        Long id = memberService.join(member);
        return new CreateMemberResponse(id);
    }

    @Data
    static class CreateMemberRequest {
        @NotEmpty
        private String name;

    }

    @Data
    static class CreateMemberResponse {
        private Long id;

        public CreateMemberResponse(Long id) {
            this.id = id;
        }
    }
}
```

이런 경우, 위에서 말했던 것 처럼 나중에 엔티티가 변경되면 API 스펙도 같이 변해야 한다.

그래서 해결책으로 **엔티티를 대체하는 DTO를 생성**하여 API 기능을 구현하면 된다.

### 좋은 예시

```java
package jpabook.jpashop.api;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
    public class MemberApiController {

    private final MemberService memberService;
    
    // 엔티티 노출하거나 받지 말고 api 스펙에 맞는 DTO를 만들고, 그걸 활용해야 한다.
    @PostMapping("/api/v2/members")
    public CreateMemberResponse saveMemberV2(@RequestBody @Valid CreateMemberRequest request) {
        Member member = new Member();
        member.setName(request.getName());

        Long id = memberService.join(member);
        return new CreateMemberResponse(id);
    }
    
    @Data
    static class CreateMemberRequest {
        @NotEmpty
        private String name;

    }

    @Data
    static class CreateMemberResponse {
        private Long id;

        public CreateMemberResponse(Long id) {
            this.id = id;
        }
    }
}
```

* 이를 통해 다음과 같은 장점을 가질 수 있다.

  * 이를 통해 엔티티와 프리젠테이션(Controller 클래스와 같은) 계층을 위한 로직을 분리할 수 있다.

  * 엔티티와 API 스펙을 명확하게 분리할 수 있다.

  * 엔티티가 변해도 API 스펙이 변하지 않는다.

> 참고: 엔티티를 외부에 노출해선 안된다.
>
> 실무에서는 기능에 따라 필요한 API가 증가하게 된다. API 마다 필요한 데이터가 다르기 때문에 **API 스펙에 맞는 별도의 DTO를 노출**해야 한다.


## Review

* 강의에서는 회원 등록 뿐만 아니라, 회원 수정 및 회원 조회 기능에 대해서도 설명했는데, 내용은 같기 때문에 생략했다.

* 혹시나 나중에 필요하게 되면, 이전에 커밋한 내용을 참고하자!

  * [회원 등록 API 기능 구현](https://github.com/devFancy/jpashop/commit/615b257fa73131c126af33892ead72311e925cfd)
  * [회원 수정 API 기능 구현](https://github.com/devFancy/jpashop/commit/55e2d5e49ae24acafa548f0c2f73c503d5a4f219)
  * [회원 조회 API 기능 구현](https://github.com/devFancy/jpashop/commit/2ca4f9bd14fb7c5d1dffcb4f9dd675d1e82426d3)

## Reference

* [실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - API 개발 기본](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94/dashboard)