---
title: "[Goodfriends] Agile 기반 Scrum 프로세스 도입"
date: 2023-08-17
categories: ["프로젝트"]
tags: ["사이드프로젝트"]
---

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)

> 이 글은 우리FISA 1기 [굿프렌즈팀의 기술 블로그](https://goodfriends-team.tistory.com/5)에 게시된 글 입니다.

## 애자일(Agile)이란?

> 애자일 소프트웨어 개발(Agile software development) 혹은 애자일 개발 프로세스는 소프트웨어 엔지니어링에 대한 개념적인 얼개로, 프로젝트의 생명주기동안 반복적인 개발을 촉진한다. - 위키백과 -


`**Agile**`은 소프트 웨어 개발 방법론 중 하나로, 서로 다른 여러 맥락에서 따른 방법론과 테크닉의 조합이다.

애자일 원칙의 `절차적인 부분`들은 **팀과 조직이 어떻게 구성되고 협업해야 하는지에 대한 것들을 규정**한다.

- 회의 방식, 구성원 각각의 역할, 요구사항 파악 방법, 작업 진척 속도 파악 방법, 점진적/반복적으로 일할 때 취하는 방식 등과 같은 것들이다.

- 팀에 정말로 중요한 것, 비즈니스 가치가 있는 것에 집중한다.


애자일 원칙의 `기술적인 부분`들은 **개발, 확장, 유지보수, 제품을 출하면서 어려움들에 대해 특정한 기술적 관례나 기술 자체를 매우 구체적으로 가이드**한다.

- 테스트 주도 개발(TDD), 페어 프로그래밍, 지속적인 통합, 단순한 디자인 원칙 등과 같은 것들이다.

## 애자일 개발 프로세스

![](/assets/img/project/goodfriends/agile_1.png)

애자일 방법론은 `프로세스 전반적인 과정(기획->디자인->개발->테스트->배포)`을 **최대한 신속하고 시간낭비 없이 프로덕트를 만드는** 다양한 방법론 전체를 일컫는다.

![](/assets/img/project/goodfriends/agile_2.png)

그 예로 스크럼(Scrum), 익스트림 프로그래밍(XP), 칸반(Kanban) 등이 있으며 가장 대표적인 것이 `스크럼`이다.

## 스크럼

> 스크럼(scrum)은 프로젝트 관리를 위한 상호, 점진적 개발방법론이며, 애자일 소프트웨어 개발 중의 하나이다. - 위키백과 -

- `스크럼`은 작은 주기(Sprint)로 개발 및 검토를 하며 효율적인 협업 방법을 제공한다.

![](/assets/img/project/goodfriends/agile_3.png)

### 주요 용어

- 제품 백로그(Product Backlog): 개발할 제품의 요구사항인 사용자 스토리 집합이며, 우선순위로 관리한다.

- 스프린트(Sprint): 기획, 개발, 테스트, 배포 작업 등의 최소 단위의 Cycle이다.

- 스프린트 계획 회의(Sprint Planning Meeting): 스프린트 목표와 스프린트 백로그를 계획하는 회의

- 스프린트 백로그(Sprint Backlog): 각각의 스프리트 목표에 도달하기 위한 필요한 작업 목록

- 일일 스크럼(Daily Scrum): 하루의 할 일을 공유하는 회의(매일 15~20분 정도 수행)

- 스프린트 리뷰(Sprint Review): 스프린트 마지막날 개발자가 개발한 내용을 주주, 고객, 제품 책임자에게 시연하고 검토(4주 스프린트 기준 4시간 정도 수행)

- 스프린트 회고(Sprint Retrospective): 스프린트 마지막날 좋았던 점, 문제점, 개선할 점을 KPT(Keep, Problem, Try) 형식으로 정리한다.(4주 스프린트 기준 3시간 정도 수행)

- 사용자 스토리(User Story): 사용자가 사용하는 관점에서 어떤 가치를 제공할 것인지를 설명한다.

- 인수 기준(Acceptance Criteria): 사용자 스토리를 완료시키기 위한 조건 명세(Given, When, Then)이다.

- 최소 실행 가능한 제품(Minimum Viable Product, **MVP**): 팀이 최소 노력으로 고객에게 검증 결과를 받을 수 있는 수준의 제품

- 칸반 보드(Kanban Board): 작업을 시각적으로 업무 상태, 흐름을 보여주는 게시판


### 스크럼 프로세스

우리 팀은 `애자일 방법론` 중에 `스크럼`을 선택하게 되었고, 아래의 스크럼 프로세스 순서로 프로젝트를 진행했다.

우리 굿프렌즈팀은 기획자가 없고 전부 개발자이기 때문에, 모두가 동등한 자율과 책임 권한으로 기획을 다 같이 진행하기로 결정했습니다.


1. PO(팀원 모두)는 제품의 요구 사항 정의서와 우선 순위를 제품 백로그로 정리한다.

2. 제품 백로그를 기준으로 스프린트 계획 미팅을 진행해서 스프린트 목표 설정과 스프린트 백로그를 정리한다.

3. 스프린트 주기(1주) 동안 프로젝트를 진행한다.

4. 데일리 스크럼 미팅을 통해 각자의 이슈를 공유한다.

5. 스프린트 종료시 모두가 모여서 스프린트 리뷰를 진행하여 중요한 코드 리뷰 및 팀원들의 산출물을 함께 살펴본다. (1주 스프린트 기준 1시간 진행)

6. 매회의 스프린트가 종료할 때마다, KPT 회고를 작성하여 한 단계 발전된 팀으로 다음 스프린트를 수행할 준비를 한다.

7. 2번으로 돌아가 반복한다. (제품의 요구 사항 정의서가 바뀐다면, 1번으로 돌아간다)


이를 기반으로 <strong>굿프렌즈팀의 Github -> [Wiki](https://github.com/woorifisa-projects/GoodFriends/wiki/데일리-스크럼-기록)</strong>에 정리한 데일리 스크럼 및 스프린트를 기록하고 있습니다.

## Reference

- [(외국) 기술 블로그: Visual guide to Agile methodologies for modern product management](https://miro.com/blog/choose-between-agile-lean-scrum-kanban/)

- [위키백과: 애자일 소프트웨어 개발](https://ko.wikipedia.org/wiki/%EC%95%A0%EC%9E%90%EC%9D%BC_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4_%EA%B0%9C%EB%B0%9C)

- [위키백과: 스크럼(애자일_개발_프로세스)](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%81%AC%EB%9F%BC_(%EC%95%A0%EC%9E%90%EC%9D%BC_%EA%B0%9C%EB%B0%9C_%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4))

- [공식문서: What is Scrum?](https://www.scrum.org/resources/what-scrum-module)

- [기술 블로그: 애자일이 무엇인가요?](https://brunch.co.kr/@insuk/5)

- [기술 블로그: 애자일 스크럼 이해하기](https://medium.com/dtevangelist/scrum-dfc6523a3604)