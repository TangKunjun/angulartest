#Title Service
Angular Title Service 用于获取和设置当前 HTML 文档的标题。Title Service 提供了以下方法：

- setTitle()
- getTitle()

首先要使用 Title 服务，我们需要从 @angular/platform-browser 库导入 Title 类，然后利用 Angular 依赖注入的机制，通过构造注入的方式注入 Title 服务
```
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  template: `
    <h3>Angular Title Service</h3>
`
})
export class AppComponent {
  constructor(public title: Title) {}
}
```

**setTitle()**
该方法用于设置当前 HTML 文档的标题，它接收一个参数：

- newTitle：标题文本

```
setTitle() {
  this.title.setTitle("标题");
}
```

**getTitle()**

```
getTitle() {
  console.log(this.title.getTitle());
}
```

在 SPA 单页应用的开发过程中，经常需要根据不同的路由显示不同的标题，即动态地设置页面的标题。针对这种需求，我们可以通过订阅路由事件，然后在页面导航成功后，利用 Title 服务动态设置页面的标题或 Meta 信息。

```
this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'Angular Example app with Angular CLI, Angular Material and more'
            });
            break;
          case '/' + AppConfig.routes.heroes: // routes: { heroes: 'heroes' },
            this.title.setTitle('Heroes list');
            this.meta.updateTag({
              name: 'description',
              content: 'List of super-heroes'
            });
            break;
        }
      }
});
```

# Title Service 源码简析
**Title 类及构造函数**
```
@Injectable({providedIn: 'root', useFactory: createTitle, deps: []})
export class Title {
  constructor(@Inject(DOCUMENT) private _doc: any) {}
}
```

通过观察 Injectable 装饰器的 Meta 元信息，我们知道 Meta 服务将被注册在根级注入器中，当首次获取 Title 服务时，将使用 createTitle() 工厂方法创建对应的实例。
```
import {Inject, Injectable, inject} from '@angular/core';

export function createTitle() {
  return new Title(inject(DOCUMENT));
}
```
**setTitle()**
```
setTitle(newTitle: string) { 
  getDOM().setTitle(this._doc, newTitle); 
}
```

以上代码通过调用 getDOM() 方法获取 DomAdapter 对象，然后调用该对象的 setTitle() 方法设置当前页面的标题。

**getTitle()**
```
getTitle(): string { 
  return getDOM().getTitle(this._doc); 
}
```
