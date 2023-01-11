---
layout: post
title:  " 클래스 다이어그램 그리는 기능 "
categories: IntelliJ
author: fancy96
---
* content
{:toc}

* 개발을 하면서 내가 짠 코드들을 머릿속으로 온전히 이해하기가 쉽지 않다.

* 그리고 개발이 시작하기 전, 끝난 이후에 구현한 것에 대한 클래스 다이어그램을 직접 그리는 시간이 오래 걸리는 경우가 있다.

* 이런 경우 'IntelliJ에서 제공하는 다이어그램 기능을 쓰면 **`시각적인 이해 +  시간 절약`** 이 되지 않을까?' 하는 마음으로 해당 포스팅을 작성하게 되었다.

## 다이어그램 그리기

* 우아한테크코스5기의 4주차 미션 `다리 건너기` 를 예시로 가져왔다.


![](/assets/img/intellij/IntelliJ-Class-Diagram_1.png)


* 해당 클래스들 중에서 원하는 클래스에 **마우스 오른쪽 버튼** 클릭을 하면, `Diagrams`라는 글씨가 보이게 된다. (예시 - Application)

![](/assets/img/intellij/IntelliJ-Class-Diagram_2.png)


* Diagrams 클릭하면, 두가지 선택이 주어지는데, 여기서 `Java clsses diagram` 을 클릭하면 된다.

![](/assets/img/intellij/IntelliJ-Class-Diagram_3.png)


* 그러면 위의 화면처럼 만들어지고 Application이라는 클래스가 보이게 된다.

* 빨간색으로 표시한 부분은 다이어그램에 표시하고 싶은 클래스 관련 요소이다.
     
    * f : 필드
    * m : 메서드(함수)
    * p : 프로퍼티스
    * I : 이너 클래스
    * 클립 모양 : 의존성을 보여줌(관계)
    * etc : 그 외에 화면 조정 기능, 출력 기능 등이 있다.


* 여기서 나는, f, m, 클립 모양을 클릭하고 마우스로 모든 클래스를 해당 클래스 다이어그램에 이동시켰다.

![](/assets/img/intellij/IntelliJ-Class-Diagram_4.png)


* 그러면 위와 같이 다이어그램이 보여지게 된다.

* 여기서 본인이 원하는 `Layout`으로 바꾸고 싶다면, 해당 클래스 다이어그램에서 마우스 오른쪽 버튼을 클릭한다.

![](/assets/img/intellij/IntelliJ-Class-Diagram_5.png)


* Layout에서 본인이 원하는 것으로 바꿔주면 된다.

* 예시로 Layout-Orthogonal-Orthogonal Groups으로 바꾸면,

![](/assets/img/intellij/IntelliJ-Class-Diagram_6.png)


* 위와 같이 Layout이 변경된다.

![](/assets/img/intellij/IntelliJ-Class-Diagram_7.png)


* 해당 클래스 다이어그램을 Export 하고 싶으면, 빨간색 부분(화살표 모양)을 클릭해서 `Export to Image...` 클릭하면 된다.


## Review

* 인텔리제이에서 해당 기능이 있는지 오늘 알게 되어서 한번 써보니, 확실히 간편하고, 빠르게 클래스 다이어그램을 그릴 수 있다는게 좋았다.

* 무엇보다도 **원하는 레이아웃(Layout)으로 바꿀 수 있다는 점**이 좋았다.