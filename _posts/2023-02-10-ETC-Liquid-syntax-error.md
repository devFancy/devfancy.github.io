---
layout: post
title: " [Jekyll] 에서 Liquid syntax error 처리하는 방법 "
categories: E.T.C
author: devfancy
---
* content
{:toc}


알고리즘 문제를 풀고 업로드를 하는데, `{% raw %}{{{% endraw %}` 또는 `{% raw %}}}{% endraw %}`를 사용하면 다음과 같은 에러를 발생시킨다.

![](/assets/img/etc/etc-liquid-syntax-error-1.png)

에러가 발생하는 동시에 build에서 `X` 표시가 나와서 업로드가 제대로 되지 않는다.

![](/assets/img/etc/etc-liquid-syntax-error-2.png)

해결 방안은 **중괄호가 시작하기 전에 raw와 끝날 때 endraw를 추가**하면 된다.

그리고 다시 commit 하고 push하면 정상적으로 통과되는 것을 확인할 수 있다.

![](/assets/img/etc/etc-liquid-syntax-error-3.png)

참고로 raw 부분과 endraw를 오타없이 제대로 입력했다면 실제 페이지에서 안나오는 것도 확인할 수 있다.

![](/assets/img/etc/etc-liquid-syntax-error-4.png)


## Reference

* [[Github블로그/Jekyll] Liquid Exception: Liquid syntax error 해결](https://iamheesoo.github.io/blog/gitblog-sol-jekyll02)