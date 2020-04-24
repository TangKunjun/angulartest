#创建 sf-lib 库
```
ng generate library sf-lib --prefix=sf
```

angular.json文件的projects属性会增加
```
"projects": {
 ****  "sf-lib-app": { // 应用目录
     ...
   },
   "sf-lib-app-e2e": { // 集成 end-to-end 测试
     ...
   }
},
```
在 angular.json 文件中添加 sf-lib 项目；<br>
在 package.json 文件中添加 ng-packagr 依赖；<br>
在 tsconfig.json 文件中添加 sf-lib 库的引用；<br>
在项目中的 projects 目录下创建 sf-lib 文件夹。<br>

angular.json文件的projects属性的用处：<br>
root —— 指向 library 库的根文件夹；<br>
sourceRoot —— library 库实际的源码目录；<br>
projectType —— 指定项目的类型；<br>
prefix —— 指定组件使用的前缀；<br>
architect —— 该对象用于配置 Angular CLI 构建流程，如 build、test 和 lint。<br>

**当完成 Angular 库开发后，我们可以通过以下命令进行库的构建：**
 ```
 ng build --prod sf-lib
```


#在应用中使用 sf-lib 库

app.module.ts
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SfLibModule } from "sf-lib";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SfLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

在 app.component.ts 组件对应的模板引用 sf-lib 默认创建的组件：
```
<sf-sf-lib></sf-sf-lib>
```

**创建 sf-lib 组件**
```
ng generate component button --project=sf-lib
```

接着从 sf-lib 模块中导出组件：
```
import { NgModule } from "@angular/core";
import { SfLibComponent } from "./sf-lib.component";
import { ButtonComponent } from "./button/button.component";

@NgModule({
  imports: [],
  declarations: [SfLibComponent, ButtonComponent],
  exports: [SfLibComponent, ButtonComponent]
})
export class SfLibModule {}
```

之后我们还需要在 public_api 中导出新建的组件：

```
export * from './lib/sf-lib.service';
export * from './lib/sf-lib.component';
export * from './lib/button/button.component';
export * from './lib/sf-lib.module';
```
对于组件来说：设置 @NgModule 的 exports 属性是为了使得元素可见，而添加到public_api.ts 入口文件是为了使得 Class 可见。在完成新建 ButtonComponent 组件的导出工作后，我们需要使用下列命令，重新构建 sf-lib 库：
```
<sf-sf-lib></sf-sf-lib>
<sf-button></sf-button>
```


**创建 sf-lib 服务**
```
ng g service data --project=sf-lib
```

命令成功执行后，将在 sf-lib/lib/src 目录下生成一个 data.service.ts 文件：
```
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }
}
```

假设我们的 DataService 需要利用 HttpClient 从网络上获取对应的数据，这时我们就需要在 SfLibModule 模块中导入 HttpClientModule 模块，且在 DataService 注入 HttpClient 服务：
```
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}
}
```
在实际开发中，我们可能需要能够灵活配置 DataService 服务中，请求服务器的地址。这里使用过 Angular Router 模块的同学，可能已经想到了解决方案：
```
@NgModule({
  imports: [HttpClientModule],
  declarations: [SfLibComponent, ButtonComponent],
  exports: [SfLibComponent, ButtonComponent]
})
export class SfLibModule {
  static forRoot(config: SfLibConfig): ModuleWithProviders {
    return {
      ngModule: SfLibModule,
      providers: [
        {
          provide: SfLibConfigService,
          useValue: config
        }
      ]
    };
  }
}
```
即通过提供 forRoot() 静态方法，让模块的使用方来配置模块中的 provider。示例中 SfLibConfig 接口和 SfLibConfigService token 的定义如下：
```
export interface SfLibConfig {
  dataUrl: string;
}

export const SfLibConfigService = new InjectionToken<SfLibConfig>(
  "TestLibConfig"
);
```
注册完 SfLibConfigService provider 后，我们需要更新
```
import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { SfLibConfigService } from "../public_api";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(
    @Inject(SfLibConfigService) private config,
    private http: HttpClient
  ) {}

  getData() {
    return this.http.get(this.config.dataUrl);
  }
}
```
更新完 DataService 服务，我们来 SfLibComponent 组件中使用它：
```
import { Component, OnInit } from "@angular/core";
import { DataService } from "./data.service";

@Component({
  selector: "sf-sf-lib",
  template: `
    <p>
      sf-lib works!
    </p>
  `,
  styles: []
})
export class SfLibComponent implements OnInit {
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe(console.log);
  }
}
```
接着我们在 AppModule 根模块导入 SfLibModule 模块的时候，配置 dataUrl 属性，具体如下：
```
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SfLibModule.forRoot({
    dataUrl: `https://jsonplaceholder.typicode.com/todos/1`
  })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
最后在 sf-lib 库开发完成后，我们可以把开发完的库发布到 npm 上
```
cd dist/sf-library
npm publish
```

# Debugger for Chrome  
Visual Studio Code的插件

#Storybook
Storybook 是一个 UI 组件的开发环境。它允许你能够浏览一个组件库，查看每个组件的不同状态，以及支持交互式的方式开发和测试组件。

Storybook 在你的应用程序之外运行。这允许你能够独立的开发 UI 组件，你可以提高组件的可重用性、可测试性和开发速度。你可以快速构建，而无需担心应用程序特定的依赖项。

这里有一些可以参考的特色示例，可以了解 Storybook 的工作原理。Storybook 这款工具很强大，它支持很多流行的框架


#npx及angular-cli-ghpages
npx 是 npm 5.2 引入了的新的工具， 用于帮助我们执行 npm 二进制任务和加速我们的工作流。而 angular-cli-ghpages 这个工具，是用于帮助 Angular CLI 的用户快速发布 Angular 应用到 Github Page。

#webpack-bundle-analyzer 和 source-map-explorer 
 webpack-bundle-analyzer 和 source-map-explorer 这两款工具来分析 Angular Bundle 的大小。
 
 **webpack-bundle-analyzer**
 Webpack Bundle Analyzer 这个工具为我们提供了交互性的 treemap 来可视化显示 webpack 打包输出文件的大小。
 
 ```
npm i webpack-bundle-analyzer --save-dev
ng build --prod --stats-json
./node_modules/.bin/webpack-bundle-analyzer dist/stats.json 或 npx webpack-bundle-analyzer dist/stats.json
```

**source-map-explorer**

source-map-explorer 是一个工具，它使用 bundle 生成的 source map 文件来分析 bundle 的组成及各部分的大小。与 webpack bundle analyzer 类似，它也提供了可视化的方案来查看分析的结果。

```
npm i source-map-explorer --save-dev
ng build --prod --source-map
node_modules/.bin/source-map-explorer dist/main.d72e9d91fd17f9fe7b8c.js
```
还有其它的第三方工具，也提供了分析 bundle 包大小的功能，比如 webpack-visualizer 和 Webpack Analyzer




 
