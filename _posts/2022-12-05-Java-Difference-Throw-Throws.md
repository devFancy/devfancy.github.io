---
layout: post
title:  " throw와 throws 차이 "
categories: Java
author: fancy96
---
* content
{:toc}

throw와 throws차이를 짚고 가기 이전에, try-catch 문에 대한 개념을 먼저 알고 가자.

---

## try-catch 문

``` markdown
try {
     예외가 발생할 가능성이 있는 실행문
}catch (Exception 클래스명 e){
     예외 처리문
}
```

- **try** 블록에 실제 실행되어야 하는 코드가 들어가며 `Exception이 발생할 가능성이 있는 코드`가 들어간다.
- **catch** 블록에는 Exception이 발생하면 실행되는 코드가 들어갑니다. 즉 `예외 처리를 하는 코드`다.

---

## throw 와 throws 차이

### throw

- `throw` : **개발자가 의도적으로 예외를 발생시키는 것**이다.

- throw라는 키워드를 이용하며, 주로 비즈니스 로직을 구현하는 과정 중 컴파일에는 문제가 없지만 해당 비즈니스 로직이 **개발자가 의도한 대로 통과하지 못했을 경우** 고의로 예외를 발생시켜야 할 때 사용한다.

- 다음 예시는 숫자가 아닌 경우 혹은 3미만 20 초과인 경우 예외를 발생시키는 경우다.

- 여기서 min은 3, max는 20을 의미한다.

![](/assets/img/java/Java-Difference-Throw-Throws-1.png)

- 예외가 발생하면, IllegalArgumentException()으로 처리된다.

- `IllegalArgumentException()` : 적합하지 않거나(illegal) 적절하지 못한(inappropriate) 인자를 메서드에 넘겨주었을 때 발생합니다.

- 이처럼 `throw` 키워드를 사용하면 **개발자의 판단에 따라 강제로 예외**를 발생시킬 수 있다.

### throws

- `throws` : 메서드 내에서 예외 처리를 하지 않고 해당 메서드를 사용한 곳에서 예외 처리를 하도록 예외를 **다른 곳**으로 던지는 것이다.
  즉, **예외를 전가시키는 것**이다.

``` java
public class Test {
	public static void main(String[] args) {
		int a = 2;
		int b = 0;
		try {
			divide(a,b);
		} catch (ArithmeticException e) {
			e.printStackTrace();
		}

	}

	public static int divide(int a, int b) throws ArithmeticException {
		if (b == 0) {
			throw new ArithmeticException("0으로 나눌 수 없습니다.");
		}
		return a / b;
	}
}
```

- 여기서 divide 메서드는 예외를 자신이 처리하지 않고 throws 키워드를 통해 자신을 호출한 main 메서드에게 책임을 전가했다.

- 이 divide 메서드를 호출한 main 메서드에서 try catch 문을 통해 예외 처리를 진행했다.


정리하자면,
> **throw**는 강제로 예외를 발생시키는 것이며, 개발자의 의도에 따라 강제로 예외를 발생시킬 수 있고,
**throws**는 자신을 호출한 메서드에게 책임을 전가하여 호출한 메서드에서 예외 처리를 하도록 강요하는 것이다.


**throw를 사용하는 이유**는 예외가 발생할 수 있는 코드가 있다는 것을 인지시키고 예외 처리를 강요하며, 여러 가지 발생 가능한 예외들을 호출한 메서드에서 한 번에 처리할 수 있게 하는 장점이 있다. 
