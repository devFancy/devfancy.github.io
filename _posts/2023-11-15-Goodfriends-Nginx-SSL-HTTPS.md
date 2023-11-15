---
layout: post
title:  " Nginx와 Let's Encrypt로 HTTPS 웹 서비스 배포하기 "
categories: Goodfriends
author: devFancy
---
* content
{:toc}

## 프로젝트 구조

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-1.png)

* 굿프렌즈 프로젝트 구조는 위 그림과 같다.

* **클라이언트와 WAS 사이에 `리버스 프록시 서버`를 둔다.**

  클라이언트는 웹 서비스처럼 리버스 프록시 서버에 요청을 하고, WAS는 리버스 프록시로부터 사용자의 요청을 대신 받는다.

  WAS는 리버스 프록시로부터 사용자의 요청을 대신 받는다.

  클라이언트는 리버스 프록시 서버 뒷단의 WAS의 존재를 알지 못한다.

  이로인해 보안이 한층 강화되었다.

  그리고 프론트엔드는 정적 소스 배포를 위해 Nginx를 사용했다.

* 이전 굿프렌즈 서버는 `HTTP` 요청으로 이뤄져있었다. 

  하지만, `HTTP`는 누군가 네트워크에서 신호를 가로채면 내용이 노출될 수 있는 문제를 발생하므로, 이를 해결하기 위해 `HTTPS`를 적용해야 한다.

  (HTTPS를 왜 사용하는지에 대한 글은 이전에 작성했던  [왜 HTTPS를 사용하나요?](https://devfancy.github.io/Technology-HTTPS/))을 참고하면 좋을 것 같다)

* 이때, **리버스 프록시 서버에 SSL 인증서를 발급해두어 `HTTPS`를 적용**한다.

  WAS 서버가 여러대로 늘어나도 SSL 인증서 발급을 추가하지 않아도 확장성이 있다.

  또한 WAS 서버가 SSL 요청을 처리하는데 드는 비용도 들지 않는다.

* 리버스 프록시 서버는 `Nginx`를 사용한다. (Nginx를 왜 사용하는지에 대한 글은 이전에 작성했던 [NGINX란?](https://devfancy.github.io/Technology-NGINX/)를 참고하면 좋을 것 같다)

  굿프렌즈 프로젝트는 백엔드 기술 스택으로 Spring Boot를 사용했기 때문에, WAS를 Spring Boot를 이용했지만, 프로젝트에 따라서 node.js, fast api, django를 사용해도 상관없다.

  `CA`로는 무료로 SSL 인증서 발급 기관인 **`Let's Encrypt`** 을 사용했다.

  또한 간단한 SSL 인증서 발급 및 Nginx 환경 설정을 위해 `Cerbot`을 사용했다.

* `Let's Encrypt`에서 `Cerbot`을 함께 사용하는 것을 권장하는 문장을 아래 이미지를 통해 확인할 수 있다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-2.png)

## 필요한 것(준비물)

* 이 글에서는 총 3개의 서버가 사용된다. AWS의 EC2 또는 타사 VPS를 사용해도 된다.

* 서버 하나는 WAS가 돌아갈 서버이고(백엔드), 다른 하나는 WS가 돌아갈 서버이고(프론트), 나머지 하나는 리버스 프록시로 사용될 Nginx 이다.

* 또한 SSL을 적용하기 위해 도메인을 2개 준비해야 한다. 

  (굿프렌즈 프로젝트의 경우 [가비아](https://www.gabia.com/)를 통해 도메인 2개를 구매했다)

### AWS EC2와 도메인 연결하기

> 아래 AWS EC2와 도메인 연결 부분에서는 가비아를 기반으로 정리했습니다.

* AWS EC2에 있는 서버를 **가비아**에서 구매한 도메인 주소와 연결하기 위해서는 `Amazone Route 53`을 이용해야 한다.

> [Amazon Route 53](https://aws.amazon.com/ko/route53/)는 가용성과 확장성이 뛰어난 **도메인 이름 시스템(DNS)** 웹 서비스입니다. Route 53는 사용자 요청을 AWS 또는 온프레미스에서 실행되는 인터넷 애플리케이션에 연결합니다.
>
> Amazone Route 53에 대한 주요 기능에 대해 자세히 살펴보고 싶다면, [Amazon Route 53 기능](https://aws.amazon.com/ko/route53/features/)을 참고하자.

* Route 53 검색 후 호스팅 영역을 생성한다.

> 굿프렌즈의 경우, 프론트엔드 도메인 이름은 `goodfriends.life`, 백엔드 도메인 이름은 `goodfriends.pro` 이다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-3.png))

* 호스팅 영역에서 `도메인 이름`과 `설명`을 아래와 같이 작성한 후 유형 부분에 `퍼블릭 호스팅 영역`을 클릭한 뒤 생성 버튼을 클릭한다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-4.png)

* 호스팅 영역에서 생성한 도메인에서 `레코드 생성` 버튼을 클릭한다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-5.png)

* 레코드 생성안에 `값`이라는 부분에 EC2 서버의 `퍼블릭 IPv4 주소`를 기입하고 생성 버튼을 클릭하면 된다. 그러면 레코드가 생성된 것을 확인할 수 있다.

* 레코드를 생성 완료했다면, `NS`(네임서버)에서 가비아와 연결할 `값/트래픽 라우팅 대상`을 확인한다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-6.png)

* 그런 다음, 해당 `값/트래픽 라우팅 대상`에 있는 값을 가비아 홈페이지에서 `My가비아` -> 구매한 도메인의 관리 탭 클릭 -> `네임서버` 설정에 동일하게 넣어준다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-7.png)

## 리버스 프록시 서버 설정

### Nginx 설치

> 아래 Nginx 설치부분은 Spring Boot 기반으로 작성한 내용입니다.

* Nginx 서버에 아래의 명령어를 입력하여 운영체제 내 패키지 정보를 업데이트를 하고나서 `nginx` 패키지를 설치한다.

```shell
sudo apt-get update
sudo apt-get install nginx
```

* 그런 다음, Nginx 버전을 확인한다.

```shell
nginx -v # nginx version: nginx/1.18.0 (Ubuntu)
```

* 현재 리눅스에서 실행 중인 프로세스 목록을 확인하기 위해 아래의 명령어를 입력한다. (nginx만 조회)

```shell
ps -ef | grep nginx
```

### Nginx 리버스 프록시 설정

* 이제 리버스 프록시를 위한 Nginx 설정을 할 것이다.

> 이 글은 sites-available/sites-enabled 기반으로 Nginx를 설정했다.

```shell
cd /etc/nginx/sites-available
vi default
```

* 위 명령을 실행해서 `default` 파일을 아래의 내용으로 채운다.

```
server {
    listen 80;
    server_name your.domain.com;

    location / {
        proxy_pass http://192.168.XXX.XXX;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
    }
}
```

* `server_name` 부분에 SSL을 적용할 도메인을 입력해준다. 굿프렌즈의 경우 서버 도메인 이름이 `goodfriends.pro`으로 입력했다.

* 이후에 Certbot이 이 `server_name`을 기준으로 Nginx 설정 파일을 찾고, 여기에 HTTPS에 대한 설정을 자동으로 추가해줄 것이다.

* `proxy_pass`는 프록시 서버가 클라이언트 요청을 전달할 리얼 서버의 주소를 적는다. 리버스 프록시의 큰 목적 중 하나는 실제 서버의 IP 주소를 클라이언트에게 노출하지 않기 위함으로서 여기서는 **Private IP**를 입력했다. **Public IP**를 입력해도 큰 차이는 없다.

## Certbot 설치 및 Let's Encrypt에서 SSL 인증서 발급

* [Certbot 공식문서](https://certbot.eff.org/)를 참고하여 서버에 HTTPS 설정을 한다. 

> 참고로 굿프렌즈의 경우 AWS EC2 서버를 생성할 때 [애플리케이션 및 OS 이미지]를 Ubuntu Server 20.04 LTS (프리 티어)로 설정했다.

![](/assets/img/project/Goodfriends-Nginx-SSL-HTTPS-cerbot.png)

* `Certbot`은 손쉽게 SSL 인증서를 자동 발급할 수 있도록 도와주는 도구이다. `Certbot`은 우분투의 snap 이라는 패키지 매니저를 사용하여 설치하는 것을 권장한다. 따라서 apt가 아닌 `snap`을 사용하여 설치한다.

* 우선 `snap`이라는 패키지를 설치하고 이미 설치되어 있는 certbot은 제거한다.

```shell
# certbot을 설치하기 위한 snap을 설치한다.
sudo apt update
sudo apt install snapd

# 이미 설치되어있는 certbot을 제거한다.
sudo apt-get remove certbot
```

* 그리고 아래의 명령어를 통해 Certbot을 설치하고, SSL 인증서를 발급 받기 위해 nginx에 연결하는 명령어를 입력한다.

```shell
# certbot을 설치한다.
sudo snap install --classic certbot

# certbot이 잘 설치되어있는지 확인한다.
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# certbot을 nginx에 연결하기
sudo certbot --nginx
```

* 이메일을 입력하고, 이용약관에 동의/비동의를 한 다음에 사용할 도메인을 입력한다. 

  * 이때, 적용할 도메인에 대한 A 레코드가 `Amazon Route 53`에 반드시 적용되어 있어야 한다.

  * 만약 기존에 적용되어 있다면, 아래처럼 도메인 이름을 알려준다.

  * 콤마(,)로 구분하여 여러 도메인을 대상으로도 설정할 수 있지만, 굿프렌즈의 경우 1개의 도메인만 설정하도록 했다.

```shell
ubuntu@ip-{프라이빗 IP 주소}:~$ sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): fancy.junyongmoon@gmail.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf. You must
agree in order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: yes

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully issued, to
share your email address with the Electronic Frontier Foundation, a founding
partner of the Let's Encrypt project and the non-profit organization that
develops Certbot? We'd like to send you email about our work encrypting the web,
EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: no
Account registered.

Saving debug log to /var/log/letsencrypt/letsencrypt.log

Which names would you like to activate HTTPS for?
We recommend selecting either all domains, or all domains in a VirtualHost/server block.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: goodfriends.pro
2: www.goodfriends.pro
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
Requesting a certificate for goodfriends.pro

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/goodfriends.pro/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/goodfriends.pro/privkey.pem
This certificate expires on 2024-01-10.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for goodfriends.pro to /etc/nginx/sites-enabled/default
Congratulations! You have successfully enabled HTTPS on https://goodfriends.pro

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

* 위 과정을 통해 Cerbot은 Let's Encrypt를 통해 자동으로 SSL 인증서를 발급해준다. 

* 또한 우리가 작성한 Nginx의 `default` 파일을 확인해보면 HTTPS를 위한 여러 설정이 자동으로 추가된 것을 확인할 수 있다.

```
server {
        server_name your domain.com;

        location / {
                proxy_pass http://192.168.XXX.XXX:8080; # set for reverse proxy
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
		    listen [::]:443 ssl;  # managed by Certbot
		    listen 443 ssl; # managed by Certbot
		    ssl_certificate /etc/letsencrypt/live/goodfriends.store/fullchain.pem; # managed by Certbot
		    ssl_certificate_key /etc/letsencrypt/live/goodfriends.store/privkey.pem; # managed by Certbot
		    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
		    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = your.domain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    return 301 https://$host$request_uri;
    listen 80;
    listen [::]:80 default_server;
    server_name your.domain.com;
    return 404; # managed by Certbot
}
```

* 첫 번째 서버 블록에서 `location / { ... }`은 모든 요청에 대한 처리 규칙을 정의한다.

  * `proxy_pass`는  실제로 요청을 처리할 upstream 서버의 주소를 설정한다. 이 경우 192.168.XXX.XXX의 IP 주소와 8080 포트로 요청을 전달한다.

  * `proxy_set_header`는 프록시 서버로 전달하는 요청 헤더를 설정한다.

  * `listen [::]:443 ssl;`, `listen 443 ssl;`을 통해 443 포트에서 SSL을 사용하여 HTTPS 트래픽을 처리한다.

  * `ssl_certificate`로 시작하는 두 줄은 SSL 인증서 및 키의 경로를 설정한다.

  * `include /etc/letsencrypt/options-ssl-nginx.conf;`는 Let's Encrypt에서 제공하는 Nginx 옵션 파일을 포함하여 보안 설정을 추가하는 것을 의미한다.

* 두 번째 서버 블록은 HTTP 트래픽을 HTTPS로 리다이렉트하는 역할을 한다.

  * `listen 80;`, `listen [::]:80 default_server;`은 80 포트에서 HTTP 트래픽을 처리한다.

  * `if ($host = your.domain.com) { return 301 https://$host$request_uri; }`은 요청 도메인이 `your domain.com`일 경우 **HTTPS로 리다이렉트하는 것을 의미**한다.

  * 만약 `HOST`가 일치하지 않으면 `404`를 반환한다.

### Certbot으로 SSL 인증서의 만료 시간 확인

* Certbot으로부터 발급받은 인증서의 만료일을 확인하기 위해 아래의 명령어를 입력한다.

```shell
ubuntu@ip-{프라이빗 IP 주소}:~$ certbot certificates
```

* 그러면 아래의 결과와 같이 56일 남은 것을 확인할 수 있다.

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: {your.domain.com}
    Serial Number: {your.serial.number}
    Key Type: ECDSA
    Domains: goodfriends.pro // your.domain.com
    Expiry Date: 2024-01-10 06:43:57+00:00 (VALID: 56 days)
    Certificate Path: /etc/letsencrypt/live/goodfriends.pro/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/goodfriends.pro/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

* 아쉽게도 Let's Encrypt에서 발급해주는 SSL 인증서는 **90일짜리 단기 인증서**이다.

* 그래서 90일마다 서버에 접속하여 SSL 인증서를 수동으로 다시 발급해줘야 한다.

* Certbot에서 이러한 SSL 인증서를 수동으로 다시 발급해주는 것이 아닌 **갱신**을 하기 위해 아래의 명령어를 입력해주면 된다.

```shell
# Certbot이 인증서 갱신을 어떻게 수행할지 테스트 명령어, 이를 통해 갱신 프로세스에 문제가 있는지 확인이 가능하다.
ubuntu@ip-{프라이빗 IP 주소}:~$ certbot renew --dry-run
```

* 여기서 실제로 갱신하기 위해서는 `--dry-run`을 실행해주면 된다.

### Crontab SSL 인증서를 갱신하는 설정

* 하지만, SSL 인증서를 수동으로 다시 발급하거나, 갱신하는 것을 넘어서 **자동화**를 해주면 매번 SSL 인증서를 신경쓰지 않아도 된다.

* 리눅스 `Crontab`을 이용해서 이를 자동화해주면 된다.

> 소프트웨어 유틸리티 `cron`은 유닉스 계열 컴퓨터 운영 체제의 시간 기반 잡 스케줄러이다. 소프트웨어 환경을 설정하고 관리하는 사람들은 작업을 고정된 시간, 날짜, 간격에 주기적으로 실행할 수 있도록 스케줄링하기 위해 cron을 사용한다. -위키백과-

* `Crontab`은 리눅스에서 제공하는 기능으로, 지정된 시간과 날짜에 정기적으로 작업을 수행하는 경우에 사용한다다.

* 즉, `Crontab`은 스케줄링 도구로 아래 명령어를 이용해서 `cron job` 하나를 생성한다.

```shell
# Crontab 편집
ubuntu@ip-{프라이빗 IP 주소}:~$ crontab -e
```

* 기본 에디터는 자신이 가장 잘 사용하는 에디터를 선택하면 된다. 필자는 **vim**(2번)을 선택했다.

* 그리고 주석 가장 아래에 아래의 내용을 추가하고 파일을 저장하면 된다.

```shell
0 0 * * * certbot renew --post-hook "sudo service nginx reload"
```

* 위 명령어의 의미를 해석하면,

  * 매월, 매일 0시 0분에 certbot을 실행하여 SSL 인증서를 갱신하고, 갱신 이후 nginx의 설정 파일을 reload 해주는 작업을 의미한다.

  * `*`이 총 5개인데, 왼쪽부터 `분(0-59)`, `시간(0-23)`, `일(1-31)`, `월(1-12)`, `요일(0-7)` 순으로 설정이 가능하다.

  * `요일`에서 0과 7은 일요일이고, 1~6이 월요일~토요일이다.

* `Crontab`의 사용은 별도로 공부를 해서 익히거나, https://crontab-generator.org/ 와 같이 제너레이터를 사용하는 방법도 있다.

* 마지막으로 `Crontab`을 재실행하는 명령어를 아래와 같이 입력해주면, 이후부터는 매월, 매일 0시 0분에 자동으로 SSL 인증서를 갱신할 것이다.

```shell
ubuntu@ip-{프라이빗 IP 주소}:~$ service cron start
```

## Reference

* https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/

* [내 서버에 HTTPS 설정하기](https://blog.pium.life/apply-https/)

* [Nginx와 Let's Encrypt로 HTTPS 웹 서비스 배포하기 (feat. Certbot)](https://hudi.blog/https-with-nginx-and-lets-encrypt/)

* https://certbot.eff.org/

* https://crontab-generator.org/