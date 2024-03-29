---
layout: post
title:  " [Git] 커밋 메세지 규약 정리 (AngularJS) "
categories: Git
author: devfancy
---
* content
{:toc}

## Git 커밋 메세지의 7가지 규칙

1. 제목과 분문을 빈 행으로 구분한다.

2. 제목을 **50글자 내**로 제한한다.

3. 제목 첫 글자는 **대문자**로 작성한다.

4. 제목 끝에는 마침표를 넣지 않는다.

5. 제목은 **명령문을 사용**하며 과거형을 사용하지 않는다.

6. 본문의 각 행은 72글자 내로 제한한다.

7. 어떻게 보다는 **무엇과 왜**를 설명한다.

---

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

* 커밋 메시지의 각 줄은 100자를 넘을 수 없습니다. 이래야지 github와 다양한 git도구들에서 쉽게 메시지를 읽을 수 있습니다.

## Subject Line (제목)

* 제목에는 변경사항에 대한 간결한 설명을 포함시킵니다.

### Type에 들어갈 수 있는 항목들 

* `feat` (feature) : 새로운 기능 추가

* `fix` (bug fix) : 버그 수정

* `docs` (documentation) : 문서 관련 내용

* `style` (formatting, missing semi colons, …) : 스타일 변경

* `refactor` : 코드 리팩토링

* `test` (when adding missing tests) : 테스트 관련 코드

* `build` : 빌드 관련 파일 수정

* `ci` : CI 설정 파일 수정

* `perf` : 성능 개선

* `chore` (maintain) : 그 외의 수정

### Scope에 들어갈 수 있는 내용들

* 어디가 변경되었는지에 관하여 변경된 부분은 모두 들어갈 수 있습니다. $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, 등등...이 들어갈 수 있으며 **scope는 생략 가능합니다.**

### Subject

* 명령형 현제 시제를 사용해야합니다. -> changed, changes가 아닌 change를 사용❗

* 첫 글자는 대문자가 아닌 소문자로 사용합니다.

* 문장 끝에 마침표(.)를 붙이지 말아야 합니다.

## Message body (내용)

* 명령형과 현제 시제를 사용해야합니다.

* 변화에 대한 이유와 이전코드와 이후 코드의 차이점을 포함시켜야 합니다.

## Message footer

### Breaking changes (주요 변경 내용)

모든 주요 변경 사항

* 변경 사항에 대한 설명 (description of the change)

* 변경사유 (justification)

* 마이그레이션 참고 사항 (migration notes) 과 함께 footer에 언급되어야 합니다.

```
BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.
    To migrate the code follow the example below:
    Before:
    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }
    After:
    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

### Referencing Issues (해결된 이슈?)

* 해결되 이슈는 커밋 메시지 하단에 `Closes #<이슈번호>`와 함께 기록해야합니다.

```
이슈가 하나인 경우
Closes #234

이슈가 여러개인 경우
Closes #123, #245, #992
```

## 예시

---

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)

```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead

```

```
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

Closes #351

```

```
style($location): add couple of missing semi colons

```

```
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace

```

```
feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

---

## Reference

* [How to Write a Git Commit Message](https://cbea.ms/git-commit/)

* [Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)