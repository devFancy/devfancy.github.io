---
title: "[Goodfriends] Set-Cookie의 보안 속성 적용기"
date: 2023-10-27
categories: ["프로젝트"]
tags: ["사이드프로젝트"]
---

[굿프렌즈 기술 블로그 방문하기 🎋](https://goodfriends-team.tistory.com/)


## 글을 쓴 계기

이번 글은 [이전 글](https://devfancy.github.io/Technology-Cookie/)에서 설명했던 쿠키의 보안속성을 실제 프로젝트(굿프렌즈)에서 어떻게 적용했는지 공유하기 위해 글을 작성하고자 한다.

## 소셜 로그인 현재 상황

현재 [굿프렌즈](https://goodfriends.life/)의 소셜 로그인은 구글로 되어있다.

소셜 로그인을 통해 발급받은 `액세스 토큰`(Access Token)은 1시간으로, 새로운 액세스 토큰을 발급하기 위해 생성한 `리프레시 토큰`(Refresh Token)은 14일로 주어져 있다.

이때 두 토큰 다 ResponseBody로 토큰을 발급받게 되면, 개발자 도구에 있는 Storage을 통해 토큰을 확인할 수 있다.

하지만, Storage에 대한 접근 및 제어는 자바스크립트를 통해 이루어지기 때문에 CSRF, XSS 등 스크립트 기반 공격이 가능해서 외부 사용자로부터 토큰 값을 탈취당할 수 있다.

## 쿠키를 이용하여 리프레시 토큰 관리

클라이언트 입장에서는 **`액세스 토큰`만 있으면 로그인이 가능**하다.

이 부분은 로컬 스토리지를 활용해서 검증할 수 있기 때문에 로그인 여부 파악에는 문제가 없다고 본다.

클라이언트에서 액세스 토큰을 재발급하는 경우는 **기간이 만료되었을 때, 리프레시 토큰을 통해 재발급** 해주면 된다.

그리고 두 개의 토큰이 로컬 스토리지에 같이 저장되면, 해커나 외부 사용자로부터 공격을 당할 수 있기 때문에 따로 보관해야 한다고 생각했다.

그래서 **유지 기간이 긴 `리프레시 토큰`을 쿠키를 이용해서 관리해 주고, 쿠키를 통해서 전달이 되도록 구현**했다.

## 쿠키의 보안 속성 적용

> AuthTokenResponseHandler

```java
@Component
public class AuthTokenResponseHandler {

    private final HttpServletResponse httpServletResponse;

    @Autowired
    public AuthTokenResponseHandler(HttpServletResponse httpServletResponse) {
        this.httpServletResponse = httpServletResponse;
    }

    public void setRefreshTokenCookie(String refreshToken) {
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None") // SameSite 설정을 None으로 추가
                .maxAge(14 * 24 * 60 * 60) // 리프레시 토큰 유효 기간 설정 (14일)
                .path("/") // 쿠키의 유효 경로 설정 (애플리케이션 전체)
                .build();

        httpServletResponse.addHeader("Set-Cookie", refreshTokenCookie.toString());
    }
}
```

위와 같이 리프레시 토큰을 저장하기 위해 AuthTokenResponseHandler 클래스에서 `ResponseCookie`형으로 선언했다.

(ResponseCookie는 스프링 프레임워크에서 제공하고 있으며, HttpCookie로부터 상속받고 있다)

그런 다음, 브라우저가 `https` 프로토콜 상에서만 쿠키를 전달해 주기 위해 보안 속성 중 하나인 **`secure`을 true**로 설정했다.

그리고, 브라우저에서 자바스크립트로 해당 쿠키에 접근하지 못하도록 쿠키의 보안 속성 중 하나인 **`httpOnly`를 true**로 설정했다.

그래서 액세스 토큰과 리프레시 토큰을 발급하는 API를 아래와 같이 구현했다.

> AuthController

```java
@RequestMapping("/api/auth")
@RestController
public class AuthController {
    private final OAuthUri oAuthUri;

    private final OAuthClient oAuthClient;

    private final AuthService authService;

    private final AuthTokenResponseHandler authTokenResponseHandler;

    public AuthController(OAuthUri oAuthUri, OAuthClient oAuthClient, AuthService authService, AuthTokenResponseHandler authTokenResponseHandler) {
        this.oAuthUri = oAuthUri;
        this.oAuthClient = oAuthClient;
        this.authService = authService;
        this.authTokenResponseHandler = authTokenResponseHandler;
    }

    // 액세스 토큰은 ResponseBody로 발급, 리프레시 토큰은 Set-Cookie로 발급 받기
    @PostMapping("/{oauthProvider}/token")
    public ResponseEntity<AccessTokenResponse> generateAccessAndRefreshToken(
            @PathVariable final String oauthProvider, @Valid @RequestBody final TokenRequest tokenRequest) {
        OAuthUser oAuthUser = oAuthClient.getOAuthUser(tokenRequest.getCode(), tokenRequest.getRedirectUri());
        AccessTokenResponse response = authService.generateAccessAndRefreshToken(oAuthUser);
        return ResponseEntity.ok(response);
    }

    // 리프레시 토큰을 이용하여 새로운 액세스 토큰을 발급 받기
    @PostMapping("/token/access")
    public ResponseEntity<AccessTokenResponse> generateAccessToken(
            @CookieValue("refreshToken") String refreshToken) {
        TokenRenewalRequest tokenRenewalRequest = new TokenRenewalRequest(refreshToken);
        AccessTokenResponse response = authService.generateAccessToken(tokenRenewalRequest);
        return ResponseEntity.ok(response);
    }
}
```

위의 코드와 같이 액세스 토큰은 ResponseBody에, 리프레시 토큰은 Set-Cookie로 발급받도록 구현했다.

그리고 액세스 토큰은 개발자 도구의 로컬 스토리지에, 리프레시 토큰은 개발자 도구의 Cookies에 저장해서 관리했고, secure 및 httponly와 같은 보안 속성을 적용했다.

이로써 보안적으로 문제가 되었던 부분인 스크립트 기반 공격으로부터 방어를 할 수 있게 되었다.

## 트러블 슈팅

서버와 클라이언트가 통신을 이용한 소셜 로그인 기능을 구현할 때 쿠키를 사용했다.

하지만, CORS 정책을 따르지 않는 쿠키는 HTTP 통신을 할 수 없게 되었고, 나 역시 이 문제를 해결하는데 2일(8H X 2D = 16H)이라는 시간이 걸렸다.

### SameSite 설정

> 해당 [이슈](https://github.com/woorifisa-projects/GoodFriends/pull/310)를 통해 자세한 문제를 확인할 수 있습니다.

https인 도메인 주소에서 소셜 로그인으로 회원가입한 사용자가 이후에 로그아웃이 되지 않는 에러가 발생했다.

로직상 액세스 토큰과 리프레시 토큰 값이 들어있어야만 로그아웃이 되도록 설정했는데, 브라우저에서는 쿠키를 이용한 리프레시 토큰 값을 받아오고 있지 않아서 에러가 발생한 것이다.

![](/assets/img/technology/Set-Cookie_1.png)

> Set-Cookie 경고창

![](/assets/img/technology/Set-Cookie_2.png)

최근 크롬 정책에 의해 서로 다른 도메인에서의 호출, 즉 SameSite 가 아닌 상태에서의 호출은 브라우저에서 막고 있다.

메세제를 확인해 보면 브라우저 기본으로 SameSite 값은 `Lax`로 설정되어 있어서 다른 사이트에서 온 요청에 의한 Cookie 설정은 막는다고 한다.

따라서, 해당 에러를 해결하기 위해 기본적으로 설정되어 있는 SameSite 값인 Lax를 `None`으로 수정하면, 서로 다른 도메인에서 온 요청에 대한 Set-Cookie를 허용해 줄 수 있다.

그래서 위에 있는 AuthTokenResponseHandler 클래스에서 ResponseCookie형인 변수 refreshTokenCookie 부분에 `.sameSite("None")`를 설정했다.

(단, 조건이 SameSite가 `None`인 쿠키는 **반드시 Secure가 true**여야 한다)

### Credentials

두 번째는 CORS 통신에 포함할 쿠키에 관한 설정이다.

> `Credentials` 이란 쿠키, Authorization 인증 헤더, TLS client certificates(증명서)를 내포하는 자격 인증 정보를 말한다.

기본적으로 브라우저가 제공하는 요청 API 들은 별도의 옵션 없이 브라우저의 **`쿠키`와 같은 인증과 관련된 데이터를 함부로 요청 데이터에 담지 않도록 되어있다.**

따라서 요청과 응답엥 쿠키를 허용하고 싶을 경우, 이를 해결하기 위한 옵션이 바로 `withCredentials` 옵션이다.

`withCredentials` 옵션은 **서로 다른 도메인(Cross Origin)에 요청을 보낼 때 요청에 `인증(credential)` 정보를 담아서 보낼지를 결정**하는 항목이다.

즉, `쿠키`나 `인증 헤더` 정보를 포함시켜 요청하고 싶다면, **클라이언트**에서 API 요청 메소드를 보낼때 `withCredentials` 옵션을 true로 설정해야한다.

또한 인증된 요청을 정상적으로 수행하기 위해선 클라이언트 뿐만 아니라 **서버**에서도 `Access-Control-Allow-Credentials` 헤더를 true로 함으로써 인증 옵션을 설정해주어야 한다.

정리하자면, **클라이언트나 서버나 둘다 Credentials 부분을 true로 설정**해줘야 한다.

1. 표준 CORS 요청은 기본적으로 쿠키를 설정하거나 보낼 수 없다.
2. 프론트에서 ajax 요청할 때, `withCredentials` 부분을 true로 해서 (수동으로) CORS 요청에 쿠키 값을 넣어줘야 한다.
3. 백엔드(서버)에서도 응답 헤더에 `Access-Control-Allow-Credentials`를 true로 설정해야 한다.

> 프론트 설정: axios 설정

`withCredentials` 옵션 부분을 axios 전역 설정으로 처리하거나 axios 요청 메서드의 옵션 인자로 넣어 보낼 수 있다.

두 가지 중 한개를 선택하면 되는데, 해당 프로젝트는 후자로 적용했다.

> index.ts

```typescript
import { API_ERROR } from '@/constants/strings/error';
import axios, { type AxiosResponse } from 'axios';

export const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Encoding': 'gzip'
};

export const apiInstance = () => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        headers: { ...headers },
        withCredentials: true
    });
    instance.defaults.timeout = import.meta.env.VITE_APP_TIMEOUT_TIME;

    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            return res;
        },
        (err) => {
            if (err.code === 'ECONNABORTED') {
                err.message = API_ERROR.TIMEOUT;
                return Promise.reject(err);
            } else {
                return Promise.reject(err);
            }
        }
    );

    return instance;
};
```

> 백엔드(서버) 설정: Spring

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final List<String> allowOriginUrlPatterns;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] patterns = allowOriginUrlPatterns.stream()
                .toArray(String[]::new);

        registry.addMapping("/**")
                .allowedMethods("*") // 허용할 HTTP method
                .allowedOrigins(patterns) // 허용할 출처
                .allowCredentials(true);
    }
}
```

> (추가) 서버 EC2의 NGINX 설정 - default

해당 프로젝트에서 NGINX와 SSL를 이용한 HTTPS를 적용하면서, 서버에서도 `Access-Control-Allow-Credentials`를 true로 설정해줘야 한다.

경로: /etc/nginx/sites-available/default

```shell
server {
  
    server_name goodfriends.pro;
    location / {
      if ($request_method = 'OPTIONS') 
        {
                            add_header 'Access-Control-Allow-Origin' 'https://goodfriends.life';
                            add_header 'Access-Control-Allow-Credentials' 'true'; # allowed Set-Cookie
                            add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, PUT, PATCH, OPTIONS';
                            
                            ...
                            return 204;
                            
        }
        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/goodfriends.pro/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/goodfriends.pro/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    
    }

}
```

## 마치며

프로젝트에 Set-Cookie의 보안 속성 적용 방법과 트러블 슈팅을 경험했다. 쿠키에 대한 개념, 그리고 보안 속성, 쿠키를 이용한 CORS 설정 등 여러 개념들을 알 수 있는 기회였고, 보안에 대한 중요성을 다시 한번 느꼈다.

위의 방식으로 기능적으로 작동되지만, 완벽히 해결했다고 볼 순 없다고 생각한다. 리프레시 토큰에 대한 보안은 되었으나, 액세스 토큰은 여전히 ResponseBody로 저장되어 있어서 언제든 해커와 같은 악성 사용자로부터 토큰 값을 탈취당할 수 있다.

프로젝트를 진행하면서 나중에 더 나은 대안이 있다면, 리팩터링을 통해 더 안전하게 보호할 수 있도록 하자.


## Reference

* [CORS 쿠키 전송하기 (withCredentials 옵션)](https://inpa.tistory.com/entry/AXIOS-%F0%9F%93%9A-CORS-%EC%BF%A0%ED%82%A4-%EC%A0%84%EC%86%A1withCredentials-%EC%98%B5%EC%85%98)

* [[10분 테코톡] 나봄의 CORS](https://www.youtube.com/watch?v=-2TgkKYmJt4&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC)