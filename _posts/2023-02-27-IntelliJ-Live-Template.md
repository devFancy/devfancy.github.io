---
layout: post
title:  " 인텔리제이 템플릿 자동완성(Live Template 적용) "
categories: IntelliJ
author: devfancy
---
* content
{:toc}

* 코드를 작성하다보면 똑같은 코드를 치는 경우가 생기는 경우에는 `Live Template` 기능을 적용시켜서 코드의 가독성을 높여보자.

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MemberRepositoryTest {

    @Autowired MemberRepository memberRepository;
    
    
}
```

* 기존 코드에서 **@Test** 와 같이 테스트코드의 형식은 똑같은 경우가 많다.

* 해당 테스트코드를 **Live Template** 기능을 적용시켜보자.

![](/assets/img/intellij/intellij-live-template-1.png)

* 위측 상단의 IntelliJ IDEA -> Settings -> Live Template

* `custom` 아래에 **tdd**라는 이름을 추가하기 위해 오른쪽에 `+` 버튼을 클릭하고, `Abbreviation` 부분에 tdd를 입력한다.

    * `Description` 부분에는 tdd에 대한 설명을 입력하면 된다.(나는 설명이 필요없기 때문에, tdd로 했다)

* 그리고 아래의 `Template text` 부분에 **반복적으로 작성할 코드**를 입력한다.

* 입력을 다한 이후에 Apply -> Ok 버튼을 클릭한다.

* 해당 코드로 넘어와서 tdd 를 입력하고 Tap 키를 누르면, 아래와 같이 **Live Template** 기능이 적용된 것을 확인할 수 있다.

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MemberRepositoryTest {

    @Autowired MemberRepository memberRepository;
    
    @Test
    public void testMember() throws Exception {
        //given
        
        //when
        
        //then
    }
}
```