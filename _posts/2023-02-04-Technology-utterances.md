---
layout: post
title: " GitHub Blog에 댓글 기능 추가(utterances) "
categories: Technology
author: fancy96
---
* content
{:toc}

> 해당 글은 Jekyll 기반 GitHub Blog 중심으로 작성한 내용입니다.

## Prologue

* 블로그를 운영한 지 이제 24일이 지났을 쯤에, 내 GitHub Blog에 수정할 부분이 뭐가 있는지 자세히 확인해봤다.

* 기존에 댓글 기능을 [Disqus](https://disqus.com/)을 사용했는데, 몇 가지 단점들이 보이기 시작했다.

1. **무료 라이센스로 사용하는 경우 광고가 붙어서** 다른 사용자가 보기 불편하다는 생각이 들었다.

2. Disqus 자체가 **무겁다**는 얘기가 주변 개발자들로부터 전해들었다.

3. 댓글을 입력하려면 Disqus 자체 회원가입을 해야 하거나, **깃허브 계정이 아닌** 페이스북, 트위터, 구글 계정으로 로그인 해야하는 불편함이 있었다.

4. 내 GitHub Blog 에만 존재할 수도 있는데, **스크롤을 맨마지막까지 내리면 해당 댓글 창이 사라지는 것**을 확인했다.

* 따라서 나는 'Disqus 보다 더 좋은 댓글 기능이 뭐가 있을까?'라는 생각으로 구글링을 한 결과, `utterances`라는 것을 발견하게 되었다.

## Utterances

![](/assets/img/technology/utterances.png)

* GitHub issues를 기반으로 하는 **가벼운 댓글 위젯**이다. 

* 블로그 댓글, 위키(wiki) 페이지 등에 해당 위젯을 사용할 수 있다.

![](/assets/img/technology/utterances_characteristic.png)

(해당 앱에 대한 자세한 설명은 [여기](https://utteranc.es/)에 가보시면 확인할 수 있습니다)

* 내가 위에서 적어두었던 **Disqus 의 단점 4가지를 모두 보완**할 수 있기 때문에 댓글 기능을 해당 위젯으로 변경하기로 했다.

## Install(설치)

* Github -> GitHub App에서 [utterances](https://github.com/apps/utterances) 페이지로 이동한다.

![](/assets/img/technology/utterances_2.png){: width="700"}

* 이미 설치된 경우 `Configure` 버튼으로 보이는데, 설치되지 않았다면 `Install`버튼이 보일 것이다.

* 해당 `Install` 버튼을 클릭하면 repository(저장소)를 선택하는 화면이 나오는데, **GitHub Blog repository(저장소)**를 선택하면 된다.

* 그리고 아래의 `Install` 버튼을 클릭하여 설치를 완료한다.

## Setting(설정)

* 설치가 완료되면 설정 페이지로 이동하는데, 해당 페이지에서 저장소에 대한 설정을 한다.

### repo

![](/assets/img/technology/utterances_setting_1.png){: width="600"}

* `repo:` 아래 입력 칸에는 본인의 "Github-ID/GitBlog-repository name"을 입력하면 된다.

* 예) Fancy96/fancy96.github.io

### Blog Post ↔️ Issue Mapping

* `Blog Post ↔️ Issue Mapping` 밑에는 블로그 Posts와 깃허브 Issues를 연동하기 위해 선택하는 항목들이다.

* 누군가가 나의 Post에 댓글을 입력하면 **해당 Post의 제목과 경로(URL)를 Issues에 표기**하기 위해 첫 번째 부분을 선택했다.

### Issue Label

![](/assets/img/technology/utterances_setting_2.png){: width="600"}

* `Issue Label` 에는 밑에 나와있는 설명대로 Issue 부분에 Label 이름을 정하는 건데, 선택 사항이므로 안해도 상관 없다.

### Theme

* `Theme` 에는 댓글에 대한 배경 색상을 정하는 부분이다. 어두운 색상 / 밝은 색상 / 그외 다양한 색상 이 있기 때문에, 본인이 원하는 색상을 선택하면 된다.

* 나는 밝은 색상을 선택했다.

### Enable Utterances

* `Enable Utterances` 의 의미는 **나의 블로그 탬플릿에 해당 `utterances` 를 적용**하는 부분이다.

* 구글링을 한 결과, 대부분 본인의 GitHub Blog 폴더의 `_layout/post.html` 혹은 `_includes/comments.html`에 해당 스크립트를 추가하였다.

* 나는 **내 GitHub Blog 구조상** 더 적절한 `_includes/comments.html`에 추가하였다. 

     (본인의 GitHub Blog 구조에 맞게 추가하는 것이 중요하다)

* 기존에 **나는 disqus 를 적용하였기 때문에 해당 부분을 주석처리하고 그 밑에 `utterances` 부분을 추가**하였다.

```html

<!--{% if site.disqus_shortname %}
<div id="disqus_thread"></div>
<script>
    /**
     * RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     * LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
     */

    var disqus_config = function() {
        this.page.url = 'https://fancy96.github.io{{ page.url }}'; // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = 'https://fancy96.github.io{{ page.url }}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };

    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document,
            s = d.createElement('script');

        s.src = '//{{site.disqus_shortname}}.disqus.com/embed.js';

        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
{% endif %} -->

<!-- utterances comment -->
<script src="https://utteranc.es/client.js"
        repo="Fancy96/fancy96.github.io"
        issue-term="pathname"
        label="comments"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
```

### GitHub repository 반영

* 이제 **GitHub repository에 `utterances`을 반영(적용)** 하면 끝이다.

* Git Desktop이 설치가 이미 되었다면, 커밋 내용을 입력하고 push 하면 된다.

* Git Desktop이 설치 되지 않았다면, `IntelliJ - 본인의 GitHub Blog 폴더 열기 - 터미널 열기` 하고 다음 명령어를 입력하면 된다. (Git 명령어 직접 입력)


``` 
git add _includes/comments.html 
git commit -m "Feat(coommets.html) : " 댓글 기능 disques 제거 후 utterances 추가 "
git push origin main
```

* (참고) 위의 방식이 아니더라도, 본인의 위치에 맞게, 커밋 메시지 규약에 맞게 입력한다.

## Review

* 마지막으로 `utterances` 부분이 **해당 GitHub Blog 에 적용**이 되었는지 확인만 하면 된다.

![](/assets/img/technology/utterances_test.png){: width="500"}

* [About](https://fancy96.github.io/about/#comments) 댓글 부분에 테스트 용도로 댓글을 입력했다.

![](/assets/img/technology/utterances_issues.png){: width="500"}

* 그리고 내 GitHub Blog 의 Issues 에 가서 확인해보니, Post 제목이 Issues 에 표기되었다.

![](/assets/img/technology/utterances_issues_2.png){: width="600"}

* 해당 Issues 부분을 클릭해서 안에 확인해보니, **해당 Post의 제목과 경로(URL)를 Issues에 표기** 된 것을 확인할 수 있다.

![](/assets/img/technology/utterances_issues_mail.png){: width="500"}

* 추가적으로 **GitHub Blog와 연동되는 이메일**에도 댓글이 왔다는 알림(Post의 제목과 경로(URL)을 확인할 수 있다.

## Reference

* [Jekyll에 Utterances, Giscus 댓글 적용하기](https://www.hahwul.com/2020/08/08/jekyll-utterances/)