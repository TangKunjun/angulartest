import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'http',
  templateUrl: './http.component.html',
  styleUrls: ['./http.component.css']
})
export class HttpComponent implements OnInit {

  params = new HttpParams().set("_page", "1").set("_limit", "10");
  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.http.get<Todo[]>(
    //   'https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10'
    // ).pipe(
    //   tap(console.log)
    // )
    //   .subscribe();


    // 设置查询参数
    // this.http.get<Todo[]>(
    //   'https://jsonplaceholder.typicode.com/todos', {params: this.params, observe: 'response'}
    // ).pipe(
    //   tap(console.log)
    // )
    //   .subscribe();

    // 设置返回类型
    // this.http.get<Todo[]>(
    //   'https://jsonplaceholder.typicode.com/todos', { params: this.params, responseType: 'text'}
    // ).pipe(
    //   tap(console.log)
    // )
    //   .subscribe();

    // 设置头部信息
    // const headers = new HttpHeaders().set("token", "iloveangular")
    // this.http.get<Todo[]>(
    //   'https://jsonplaceholder.typicode.com/todos', { params: this.params, headers}
    // ).pipe(
    //   tap(console.log)
    // )
    //   .subscribe();

    // 并行发送请求
    // const parallel$ = forkJoin(
    //   this.http.get("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=5"),
    //   this.http.get("https://jsonplaceholder.typicode.com/todos?_page=2&_limit=10")
    // );
    //
    // parallel$.subscribe(values => {
    //   console.log("all values", values);
    // });

    // 顺序发送请求
    // const sequence$ = this.http.get("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=5").pipe(
    //     switchMap(dos => {
    //       return this.http.get("https://jsonplaceholder.typicode.com/todos?_page=2&_limit=10");
    //     }, (sult1, sult2) =>  [sult1, sult2])
    // );
    // sequence$.subscribe(value => console.log(value));

    // 请求异常错误
    // this.http.get("https://jsonplaceholder.typicode.com/simulate-error")
    //   .pipe(
    //     catchError(error => {
    //       console.error("错误 catched", error);
    //       return of({ description: "错误" }); // 加了将走正确的路线
    //     })
    //   ).subscribe(
    //   val => console.log("收到：description: 错误", val),
    //   error => {
    //     console.error("请求错误", error);
    //   },
    //   () => console.log("HTTP Observable completed...")
    // );

    // 请求进度
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
            console.log("正在下载:"+ load + "Kb");
            break;
          case HttpEventType.Response:
            console.log("完成");
        }
      });

  }

}
