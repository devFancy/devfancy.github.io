---
layout: post
title: " Linux - 다양한 명령어 정리 "
categories: Linux
author: devfancy
---
* content
{:toc}


## Prologue

* Linux 명령어에 대해서 제대로 복습하고 정리하기 위해 해당 글을 작성하게 되었다.


## 1. Linux

* Linux = Unix + Minix
  
  * MultiUser, MultiTasking
    
  * opensource
    
  * There is no distinction between users and developers. Anyone can become a developer

### Linux Characteristic
  
* 권한을 갖는다
    
* 허가권 / 소유권
  
* 다중 사용자 환경을 지원한다. (MultiUser mode 및 MutiTasking을 지원)
  
* 대/소문자를 구분한다.
  
* 확장자는 무관하고 파일명의 일부로 사용한다.

  + Window에서 사용하는 확장자 개념이 없다.

### Prompt structure

* Prompt ?

  * 명령어를 입력받아서 실행 될 수 있는 상태

* Linux Prompt
  
  * 관리자    : [root@localhost~ ]#
    
  * 사용자    : [user@localhost~ ]$
    
  * [ , ]    : prompt 구분 기호
    
  * root, user : 서버에 로그인한 계정명
    
  * localhost  : 서버의 이름
    
  * ~          : 경로의 마지막 경로명 출력
  
    * ex) cd ~ home -> home 경로로 출력된다.


#### Basic commands

| 명령어 이름 |의미|
|--|----|
|ifconfig|IP 확인|
|pwd|현재 작업중인 디렉토리 출력/확인|
|cd|내가 현재 있는 경로의 위치를 변경할 때 사용|
|cd ..|현재있는 경로에서 상위경로로 이동|
|cd -|바로 이전에 갔던 경로로 이동|
|cd ~|현재 작업중인 계정의 홈 디렉터리로 변경|
|clear|현재 화면을 깨끗이 지움|

### 절대경로 / 상대경로 비교

* 절대경로 : '/'부터 시작
  
* 상대경로

  * ./ : 현재위치
          
  * ../ : 상위 디렉토리
          
  * ex) /home/knu/systemprogramming/1 -> /home/ces/security/2  1에서 2로 이동하려면 어떻게 해야하는가 ?
  
  * [1] 절대경로로 하면 ? cd /home/ces/security/2/
  * [2] 상대경로로 하면 ? cd ../../../ces/security/2/


## 2. Linux_Commands

* `man` : 명령어에 대해 알려준다. 형식: man [ 옵션 ] 명령어
  
* ex) man [명령어]
    
* `man` 옵션

  * -a : 찾고자 하는 명령어의 검색된 메뉴얼 페이지를 모두 출력함
              
  * enter : 한줄씩 이동
              
  * space : 한페이지씩 이동
              
  * :q    : 종료(해당 화면에서 빠져나온다)
          
  * -w : man 명령 실행 시에 호출되는 '메뉴얼 페이지' 파일의 위치를 보여준다.(--path)


### Navigating file system(파일 시스템 탐색하기)

* `pwd`(print working directory) : 현재 경로를 출력


* `ls`(list) : 디렉터리 안에 내용 출력
  
* `ls` 옵션
        
  * -a : ,(숨김)을 포함한 디렉토리 안에 모든 파일과 디렉토리 출력

  * -l(L): 자세히 출력
          
  * -n : 파일 및 디렉토리 출력시 UID, GID 를 숫자로 출력
  
  * ex) ls -al : 문자로 출력  / ls -an : 숫자로 출력
    
  * -R : 지정한 디렉토리 하위경로와 그 안에 있는 모든 파일및 디렉토리를 출력
            
  * -F : 형식을 알리는 문자를 각 이름 뒤에 추가 ( 쉽게말해, 파일의 형식을 가로로 출력)
                
  * / : 디렉토리( 허가권 맨앞 "d")
                
  * / 없다 : 파일( 허가권 맨앞 "-")
                
  * @, -> : 바로가기( symblic linkfile) 앞 "사본" 뒤 "원본" ( 허가권 맨앞이 l이면 허가권 모두가 활성화)
            
  * -d : 지정한 데릭토리(또는 파일) 정보 출력


* `cd`(change directory) : 내가 현재 있는 경로의 위치를 변경할 때 사용한다.

* `find` : 주어진 조건을 검색하여 파일이나 디렉토리를 찾을때 쓰인다.

* `find` 옵션 : f (파일), d (디렉토리), l (심볼링크)
  
  * [1] find [ 경로 ] [ -name ] [ 찾을이름 ] : 찾을 이름을 검색
    
  * [2] find [ 경로 ] [ -name ] [ 찾을이름 ] [ -type ] [ option ] : 찾을 이름의 타입을 지정하여 검색
        
    * -name 과 -type 위치가 바껴도 상관없다.
    
    * ex) file을 찾을 경우 -> find . -type file -name "*.txt" => 현재위치에서 file 형식이고 이름이 .txt인 모든 파일을 찾는다.
          
    * ex) directory를 찾을 경우 -> file . -type directory -name "*2" => 현재위치에서 directory 형식이로 이름이 2가 있는 모든 디렉토리를 찾는다.
          
    * -type은 앞부분만 써도 되고(d), 다 써도(directory) 상관없다.

  * [3] find [ 경로 ] [ -newer ] [ 찾을이름 ] : 찾은 이름 이후에 생성 또는 수정된 것을 검색
    
  * [4] find [ 경로 ] [ -name ] [ "찾을이름" ] [ -exec ] [ command ] {} \; : 이름 찾은후 명령어 실행

* `which` : 실행하고자 하는 프로그램이 어디에 설치되어 있는지 경로를 확인할 때 사용한다.
  
* ex) which [node] : node의 경로를 알려준다.


### Create and manage file(파일 생성 및 관리하기)

* `touch` : 빈 파일 생성, 시간 변경

* `cat` : 파일안의 내용 출력한다. 형식 : cat [ 옵션 ] [ 파일이름 ]
  
  * cat [ file ] : 파일 내용 출력

* `cat` 옵션

  * cat /etc/passwd > /test : test파일안에 디렉토리 내용 입력(복사)
          
  * cat > ./test            : 내용입력
                
  * ctrl + d : 정상 종료
              
  * ctrl + z : 강제 정지
              
  * ctrl + c : 강제 종료

* cat ./test1 >> ./test2    : test2 내용밑에 test1 내용 추가

* cat ./a ./b > ./c         : ./a ./b내용을 ./c에 병합 (기존 c안에 있는 내용은 사라진다)


* `mkdir` : 디렉토리 생성

* `mkdir` 옵션
        
  * -p : 하위 디렉토리 생성시 상위디렉토리가 없으면 상위 디렉토리도 생성
        
  * -v : 성공 / 실패 메세지 출력


* `cp` : 파일 및 디렉토리 복사, 이름변경 가능
  
* `cp` 특징

  1. 원본파일 복사할때 생략가능
        
  2. 원본파일 복사할때 이름바꿔서 복사가능

  3. **생성날짜 / 시간 복사 x** (복사할 때 날짜, 시간은 바뀐다.)

* `cp` 옵션
        
  * -p : 원본 그대로 복사(**날짜, 시간 그대로 가능**)
          
  * -r : 디렉토리 복사할 경우 사용, 하위 모든 내용도 복사

* `mv` : 파일 및 디렉토리 이동( 옵션 필요 X ), 이름변경(원본자체가 이동, 단, 파일만 가능)
  
* `mv` 특징

  1. 생성날짜, 시간 그대로 복사됨

  2. 이름 바꿔서 이동 가능 => ex) mv file1 file2 : file2가 없으면 file1이 file2로 이름이 바뀌면서 이동을 하는 의미이다.


* `rmdir` : 디렉토리 삭제 (**빈 디렉토리만 삭제가능**)

* `rm` : 파일 및 디렉토리 삭제 ( 중요 )
  
* `rm` 옵션

  * -i : 삭제시 사용자에게 물어본다
          
  * -f : 삭제시 사용자에게 물어보지 않고 삭제
          
  * -r : 디렉토리 삭제, 하위파일 및 디렉토리 모두 삭제
  
  <pre>[cf] rm -rf ./* : 현재 위치한 경로의 모든 파일및 디렉토리 삭제</pre>


* `grep` : 한 파일 안에서 키워드로 검색을 하거나 프로젝트 전체에 한해서 키워드로 검색을 할 경우
  
* `grep` 옵션
        
  * -n : 몇번째 줄인지 확인 => ex) grep -n "world" *.txt : world가 몇번째 줄에 있는지 확인할 수 있다.

  * -i : 대소문자 구분 X => ex) grep -ni "world" *.txt
          
  * -r : 해당 키워드를 전부 검색하고 싶을 때 => ex) grep -nir "world" . : 현재 경로에서 하위폴더까지 world라는 키워드를 대소문자 구분없이 몇개있는지 확인한다.


### 그 외 기타 명령어들

* `ln` : 하드링크나 심볼릭 링크 파일을 생성( 디렉토리는 심볼릭 링크만 가능)
  
  * 하드링크(파일만), 심볼릭링크(파일, 디렉토리 둘다 가능)
  
* `ln` 옵션
        
  * -s : 심볼릭링크 파일 생성
          
  * ln [ 옵션 ] 원본파일 하드링크파일(이름다르게)
          
  * ln [ 옵션 ] 원본파일 심볼릭링크파일
    
* `ln` 참고
       
  * 맨앞이 l(L)아면 심볼릭 링크 파일이다
       
  * '-' : 파일
       
  * 'd' : 디렉토리

* `alias` : 복잡한 명령어와 옵션을 짧은 문자(열)로 바꿔준다.
  
  * ex1 : a1 = /alias/ 디렉토리 생성
            
    * alias <u>문자</u> = '명령어 파일' => alias a1 = 'mkdir /alias/'
        
  * ex2 : a2 = /alias/ 디렉토리에 testfile 생성
            
    * alias a2 = 'touch /alias/testfile'
        
  * ex3 : a3 = /alias/ 디렉토리 삭제
            
    * alias a3 = 'rm -rf /alias'

  * [cf] 만약 결과가 "zsh : band assignment" => 불필요한 공백을 제거하라는 의미다. '=' 앞, 뒤 공백을 제거하면 된다.

* `head` : 파일의 내용 출력, 기본값으로 10줄 출력, 위 -> 아래 출력
  
* `head` 옵션
        
  * -n: : 줄수만큼 출력 ( 생략가능 -> head만 가능) ex) head -n5 = head -5

* `tail` : head 와 같다. 단, 아래 -> 위 출력

* `more` : 파일을 화면 단위로 출력한다. 형식: more [ 옵션 ] 파일
  
  * 해당 화면
  
    * enter : 한줄씩 이동
          
    * space : 한페이지씩 이동
            
    * :q    : 종료(해당 화면에서 빠져나온다)

  * 추가 기능
  
    * k     : 위로 이동
              
    * j     : 아래로 이동
  

* `less` : more과 같은 기능

* `nl(NL)` : 파일의 각 줄 (맨앞에) 번호를 붙여서 전체 출력. more과 같은 기능

### Work with environment variable (환경변수 설정하기)

* `환경변수`란 내 컴퓨터에서 특정한 키워드가 어떠한 일을 하거나 경로를 저장할 수 있도록 만들어주는 것이다.

* 환경변수는 **대문자**로 만들고, 공백이 없어야하고, 단어사이에는 "_"를 이용한다.

* export MY_DIR="dir1" => dir1를 MY_DIR이라는 환경변수를 설정하였다.

* env : 모든 환경변수를 출력해주는 명령어

* unset MY_DIR => 지정된 환경변수를 삭제하는 명령어
