---
layout: post
title:  " [Git 마스터과정] Git Merge 정리하기 "
categories: Git
author: devfancy
---
* content
{:toc}

> 이 글은 Git 마스터 과정에서 배운 것을 정리한 내용입니다.

## Merge

* fast-forward 같은 경우는 **master branch에서 새로운 branch가 생성된 이후에 master branch의 변동사항이 없다면**,  merge를 할 때, 단순히 master branch가 가리키고 있는 포인터를 새로운 branch(featureA)로 옮기면 된다. 그리고 branch를 삭제하면 된다. 

* fast-forward 단점 - 히스토리에 merge가 되었다는 사실이 남지 않는다.

```bash
[fast-forward merge 하는 경우] - merge하는 동시에 이전 feature-A가 사라지게 된다. 
	=> 깔끔한 merge (history에 남지 않기 때문)
git merge featureA #merges featureA branch into the current one
	# 현재 위치인 master가 featureA로 merge되면서 이동된다.
	# featureA로 merge 했다면 더이상 feature-A의 branch가 필요없기 때문에
	# 해당 branch를 삭제한다. => git branch -d feature-A

---
[fast-forward  merge 하기 싫은 경우] -> --no-ff 옵션을 사용한다.
git merge --no-ff featureA #creates a merge commit 

---
[fast-forward merge 불가능한 경우] => Three-way merge를 이용해야 한다.
- master branch와 파생된 feature-A branch의 변동사항을 모두 합해서 
- merge commit을 만든 다음에 master branch에 commit을 해야한다.
=> fast-forward가 불가능한 상황에서 git merge feature-A 를 하게 될 때,
따로 merge commit이 만들어진다. => 해당 commit을 종료하고 git hist를 통해
새로운 merge commit이 만들어진 것을 볼 수 있다.

---
git merge --squash featureA #suqash merge, only one commit
git merge --continue 
git merge --abort # merge하는 것을 취소하고 싶을 때
git mergetool #opens merge tool 
```

## Conflict 해결 방법

* 예) feature → master에 merge를 할때, conflict이 발생했다.

* merge를 했을 때, conflict상황이 발생했다면  다음과 같은 상황이 발생한다.

![](/assets/img/git/git-master-merge-1.png)

* git status → 입력하게 되면 아래와 같이 나타나게 된다.

![](/assets/img/git/git-master-merge-2.png)

* cat main.txt → 아래와 같은 <<<< HEAD ~~~ >>>>> feature 이라는 메세지가 추가된다.

![](/assets/img/git/git-master-merge-3.png)

### 해결방안 1) 수동적 해결

* **open main.txt** 입력 → 수동적으로 둘 중 하나만 남기고 나머지는 지운다

* “Oh.. Here!! From master branch!” 만 남기고 지우거나 둘다 남겨도 된다.

* 단, 새로운 메세지를 추가해서는 절대 안된다 → 현직 개발자들도 실수를 종종 한다.

* git status에 보시면 “git add <file>...” 라는 것을 해결할 수 있다고 나와있다.

* **git add main.txt** → git status를 하면 수정이 되었고, merge을 이어서 계속하면 → `git merge --continue` 입력하면 아래와 같이 **merge가 성공**적으로 되는 것을 볼 수 있다.

![](/assets/img/git/git-master-merge-4.png)

* 추가 설명) `git merge --continue` 이것은 fast-forward merge가 아니기 때문에,  merge commit이 만들어진다.  타이틀을 입력한 다음에, 파일을 끄면 **merge가 완성**되는 것을 볼 수 있다.

### 해결방안 2) VSCode로 Conflict 해결하기

* git config --global -e 입력 → 다음 4줄을 맨 밑에 추가해준다.

* 다음 4줄을 추가해주고 닫아준다.

```bash
[merge]
tool = vscode
[mergetool "vscode"]
cmd = code --wait $MERGED
```

* `git merge feature` (conflict 발생한지 확인 후) → `git mergetool` 입력한다.

* 다음 과 같은 **4가지 옵션중에 한가지를 고르면 된다**. → A선택, B선택, 둘다선택, 두개 비교 (예시 - Accept Current Chage = A선택) 

![](/assets/img/git/git-master-merge-5.png)

* 선택 후 닫으면 conflict해결되면서 merge완료되는 것을 알 수 있다. → `git status`로 확인한다.

![](/assets/img/git/git-master-merge-6.png)

![](/assets/img/git/git-master-merge-7.png)

* 그러면 git status 에서 **main.txt.orig** (오리지널 파일)보이는데, 이것은 이전에 merge conflict이 발생하였을 때, 내용이 포함된 것을 볼 수 있다.

* 이것을 끈다고 하면, `git config --global mergetool.keepBackup false` 입력한다.

* 또는 `git config --global -e` → edit 창에 들어가서 [merge] 밑에 다음과 같이 추가해줘도 된다. ⇒ 기존 4줄 밑에 추가한다.

```bash
[merge]
tool = vscode
[mergetool "vscode"]
cmd = code --wait $MERGED
[mergetool]
keepBackup = false
```

* `git merge --abort` : merge 취소

* `git clean -fd` : false적으로 directory에 있는 것들을 정리한다. (“Removing main.txt.orig” 라는 메세지가 나오는 것을 볼 수 있다)

* **다시 처음부터 merge를 한다.** git merge feature → git mergetool (수정하고) → git status를 확인해보면, **main.txt.orig이 생기지 않는 것을 볼 수 있다**.

* 마지막으로 `merge --continue` 입력 (→ commit 메세지 저장후 종료) → **merge 완료**


### 해결방안 3) P4Merge로 Conflict 해결하기

* 무료툴이고, 조금 더 막강한 개발자들이 많이 사용한다.

* 다운로드 방법 : Google 홈페이지에서  `p4merge` 검색 → [해당 홈페이지](https://www.perforce.com/ko/jepum/helix-core-apps/merge-diff-tool-p4merge) -> `다운로드` 버튼 클릭 -> 운영체제(`Mac`) 선택 후 `DOWNLOAD` 버튼 클릭

    -> 해당 메세지(이름,이메일,핸드폰번호)는 입력하지 않고, 위에 `Skip registration` 버튼 클릭하면 다운로드 된다.

* `git merge feature` 입력 → merge conflict 발생한다. 현재 mergetool이 vscode 설정되었기 때문에, 설정에 들어가서 megetool을 **P4Merge**로 바꿔야한다.

* `git config --global -e` 입력한다. (입력하면 edit 창으로 이동하게 된다)

* 다음과 같이 merge, mergetool을 p4merge에 맞게 수정해준다.

```bash
[merge]
    tool = p4merge
[mergetool]
	keepBackup = false
[mergetool "vscode"]
    cmd = code --wait $MERGED
[mergetool "p4merge"]
    path = "/Applications/p4merge.app/Contents/MacOS/p4merge"
```

![](/assets/img/git/git-master-merge-8.png))

* `git mergetool` 입력하면 → p4merge에 대한 창이 나오게 된다.

![](/assets/img/git/git-master-merge-9.png)

* **p4merge창 설명**

    * 오른쪽에 초록색으로 되어있고, `LOCAL`이라고 적혀져 있는 의미는 내가 지금 작업하고 있는 branch를 말한다. (= master branch 변경사항을 의미한다)

    * 왼쪽에 파랑색으로 되어있고, `REMOTE`라고 적혀져 있는 의미는 내 작업환경이 아니라 merge하고자 하는 branch를 말한다. (= feature branch 변경사항을 의미한다)

    * 가운데는 이 두가지의 변경사항이 없는 base를 확인할 수 있다.


* **변경 사항**) 밑에 있는 main.txt 우측에 동그라미 버튼이 있는데, 거기서 파랑색 버튼을 클릭하거나 초록색 버튼을 클릭할 수 있다. **만약 두가지 동시에 선택**하고 싶으면 `Shift`키을 누르면서 동그라미 버튼을 클릭하면 된다.

![](/assets/img/git/git-master-merge-10.png)

* **저장**)  왼쪽 상탄 저장버튼을 클릭하거나 `command + s` 누르면 된다. 

* 그리고 해당 창을 나간 후에 터미널에 돌아오면, 여전히 명령어를 수행하는 것을 볼 수 있는데, 여기서 `Ctrl + c` 을 누르고 `git status` 입력하면 main.txt가 **modified 되었다**는 것을 알 수 있다.

![](/assets/img/git/git-master-merge-11.png)

* `git merge --continue` 입력 → (해당 창에 메세지 입력후 저장후 창 나가면) merge가 정상적으로 완료된다.

Merge tool Config 

```bash
[merge]
    tool = vscode
[mergetool]
	keepBackup = false
[mergetool "vscode"]
    cmd = code --wait $MERGED
[mergetool "p4merge"]
    path = "/Applications/p4merge.app/Contents/MacOS/p4merge"
```

## Reference

* [git 공식문서](https://git-scm.com/book/en/v2)

* [Dream Coding - Git 마스터 과정](https://academy.dream-coding.com/courses/git)