DustRenderServer
================

#install
```
// git clone
npm install
```

#run
```
node app.js
```

#api
## dust compile
파라메터 or form data로 **id**, **markup**이 넘어오면 dust compile한 결과를 반환함
```
GET, POST /compile
```
### Parameters
| key    | value                 |
|:-------|:----------------------|
| id     | compile시 지정 할 id   |
| markup | compile할 markup html |

test url : http://dust.winterwolf.me/compile?id=test&markup=%3Cdiv%3E%EC%9D%B4%EB%A6%84%20:%20{name},%20%EB%82%98%EC%9D%B4%20:%20{age}%3C/div%3E

## dust rendering
파라메터 or form data로 **id**, **compiledMarkup**, **data**가 넘어오면 compile된 markup에 data json을 이용하여 렌더링한 결과를 반환함
```
GET, POST /render
```
### Parameters
| key            | value                 |
|:---------------|:----------------------|
| id             | compile된 markup의 id |
| compiledMarkup | compile된 markup      |
| data           | dust rendering에 사용할 json data. optional |

test url : http://dust.winterwolf.me/render?id=test&compiledMarkup=(function(){dust.register("test",body_0);function%20body_0(chk,ctx){return%20chk.write("<div>이름%20:%20").reference(ctx.get(["name"],%20false),ctx,"h").write(",%20나이%20:%20").reference(ctx.get(["age"],%20false),ctx,"h").write("</div>");}return%20body_0;})();&data={"name":"KTH","age":29}
