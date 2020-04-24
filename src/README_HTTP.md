#get

普通写法
```
  this.http.get<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10'
  ).pipe(
    tap(console.log)
  )
    .subscribe();

```
params的写法
```
params = new HttpParams().set("_page", "1").set("_limit", "10");
this.http.get<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10',
    {params}
  )
  
fromString写法：
const params = new HttpParams({fromString: "_page=1&_limit=10"});

fromObject写法：
const params = new HttpParams({ fromObject: { _page: "1", _limit: "10" } });
```

#获取完整响
默认情况下，HttpClient 服务返回的是响应体，有时候我们需要获取响应头的相关信息，这时你可以设置请求 options 对象的 observe 属性值为 response 来获取完整的响应对象。

```
this.http.get<Todo[]>(
  'https://jsonplaceholder.typicode.com/todos', {params: this.params, observe: 'response'}
).subscribe(v => console.log(v.headers));
```

#设置响应类型
如果你期望的响应对象的格式不是 JSON，你可以通过 responseType 属性来设定响应类型
```
this.http.get<Todo[]>(
  'https://jsonplaceholder.typicode.com/todos', {params: this.params, responseType:  "text"}
).subscribe(v => console.log(v.headers));
```
#设置 Http Headers

```
const headers = new HttpHeaders().set("token", "iloveangular")
this.http.get<Todo[]>(
  'https://jsonplaceholder.typicode.com/todos', {params: this.params, headers}
).subscribe(v => console.log(v.headers));
```

 #并行发送请求
```
    const parallel$ = forkJoin(
      this.http.get("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=5"),
      this.http.get("https://jsonplaceholder.typicode.com/todos?_page=2&_limit=10")
    );

    parallel$.subscribe(values => {
      console.log("all values", values);
    });
```

#顺序发送请求
```
const sequence$ = this.http.get("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=5").pipe(
   switchMap(dos => {
     return this.http.get("https://jsonplaceholder.typicode.com/todos?_page=2&_limit=10");
   }, (sult1, sult2) =>  [sult1, sult2])
);
sequence$.subscribe(value => console.log(value));
```

#异常处理
```this.http.get("https://jsonplaceholder.typicode.com/simulate-error")
  .pipe(
    catchError(error => {
      console.error("错误 catched", error);
      return of({ description: "错误" }); // 加了将走正确的路线
    })
  ).subscribe(
  val => console.log("收到：description: 错误", val),
  error => {
    console.error("请求错误", error);
  },
  () => console.log("HTTP Observable completed...")
);
```

#http拦截器

```
注入：
providers: [{
  provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
}],

服务：
import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from '../../node_modules/rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clone = req.clone({
      headers: req.headers.set('X-CustomAuthHeader', 'iloveangular')
    });
    return next.handle(clone);
  }

  constructor() { }

}
```

#请求进度
``` 
this.http.get<Todo[]>(
  'https://jsonplaceholder.typicode.com/todos', {observe: 'events', reportProgress: true}
).subscribe((event: HttpEvent<any>) => {
  switch (event.type) {
    case HttpEventType.Sent:
      console.log("发送");
      break;
    case HttpEventType.ResponseHeader:
      console.log("接到响应头");
      break;
    case HttpEventType.DownloadProgress:
      const load = Math.round(event.loaded / 1024);
      console.log("正在下载:"+ load);
      break;
    case HttpEventType.Response:
      console.log("完成");
  }
});
```
