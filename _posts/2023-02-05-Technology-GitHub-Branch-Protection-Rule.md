---
layout: post
title: " GitHub에 올라간 Branch에 Protection Rule 적용하기 "
categories: Technology
author: fancy96
---
* content
{:toc}

## Prologue

![](/assets/img/technology/GitHub-Branch-Protection-Rule_1.png)

* CS 스터디를 진행하면서 저장소를 관리하기 위해 커밋 메시지 Rule을 정했지만, Branch에 대한 Rule을 정하진 않았다.

* Git의 Branch는 협업을 위한 기본 토대이기 때문에 최소한의 Rule이 있어야 협업 시의 혼란을 방지할 수 있다.

## Branch protection rule

![](/assets/img/technology/GitHub-Branch-Protection-Rule_2.png)

* GitHub에서 GitHub에 올라간 Branch들에 대해 Rule을 지정할 수 있게 도와준다.

* 이 Rule을 적용하면 특정 Branch를 실수로 지우거나 Branch에 강제로 푸시할 수 있는 지에 대한 여부를 정의할 수 있다.

* 그리고 Merge하기 전에, 상태를 확인하거나 선형 커밋 기록과 같은 것들을 Branch에 푸시하는 것에 대한 요구 사항을 설정할 수 있다.

## Branch name pattern

* Branch Protection Rule이 적용되도록 Branch 이름을 적어둔다. 

* 기본적으로 main(또는 master)를 적어둔다.

## Protect matching branches

* 다음으로 Protection Rule이 적용될 Branch의 패턴을 만들고, 해당 Branch에 대해 8가지 Rule을 설정한다.

![](/assets/img/technology/GitHub-Branch-Protection-Rule_3.png)

### Require a pull request before merging

* 8가지 Rule 중에 가장 많이 쓰이는 Rule 이다.

* 모든 Commit들은 별도의 Branch를 만들어서 Merge 하기 전에 PR(pull request)을 보내야 하는 Rule이다.

* 즉, 로컬에서 Direct Push가 안되고, Push를 하려면 별도의 Branch를 만들어야 한다.

* 협업 시 Branch를 로컬로부터 Direct Push를 막아주고 코드리뷰를 통해 Merge 할 수 있다.

#### Require approvals

![](/assets/img/technology/GitHub-Branch-Protection-Rule_4.png)

* 개인이 PR를 보내고 Merge를 하기 전에 승인해주는 인원을 정하는 의미다. 

* 예) `Required number of approbals before merging : 1` 은 1명만 승인해주면 된다는 의미다.

* 그 밖에 다양한 설정들이 있다.

## Require status checks to pass before merging

* 8가지 Rule 중에 두번째로 많이 쓰이는 Rule이다.

* 테스트에 통과하게 되면 Merge를 할 수 있다는 Rule이다.

---

* 그 외 나머지는 설명만 보면 이해가 돼서 Pass 하겠다.

## Rules applied to everyone including administrators

![](/assets/img/technology/GitHub-Branch-Protection-Rule_5.png)

* 이 두 가지는 특별한 일이 아니면 사용하지 않는 게 좋다.