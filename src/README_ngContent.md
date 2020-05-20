#内容投影
在 Angular 中引入了内容投影的概念，即通过使用 <ng-content> 指令来实现内容投影的功能。
接下来我们来看一下，如何利用 <ng-content> 指令实现上述的功能
首先我们来定义 AuthFormComponent 组件：
```
import { Component, Output, EventEmitter } from "@angular/core";

import { User } from "./auth-form.interface";

@Component({
  selector: "auth-form",
  template: `
    <div>
      <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
        <ng-content></ng-content>
        <label>
          邮箱
          <input type="email" name="email" ngModel>
        </label>
        <label>
          密码
          <input type="password" name="password" ngModel>
        </label>
        <button type="submit">
          提交
        </button>
      </form>
    </div>
  `
})
export class AuthFormComponent {
  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  onSubmit(value: User) {
    this.submitted.emit(value);
  }
}
```
然后我们在 AppComponent 组件中，使用上面定义的 AuthFormComponent 组件，具体如下：
```
import { Component } from "@angular/core";

import { User } from "./auth-form/auth-form.interface";

@Component({
  selector: "app-root",
  template: `
    <div>
      <auth-form 
        (submitted)="createUser($event)">
        <h3>注册</h3>
      </auth-form>
      <auth-form 
        (submitted)="loginUser($event)">
        <h3>登录</h3>
      </auth-form>
    </div>
  `
})
export class AppComponent {
  createUser(user: User) {
    console.log("Create account", user);
  }

  loginUser(user: User) {
    console.log("Login", user);
  }
}
```

这里我们来做个总结，包含在 <auth-form> 标签内的内容，会被投影到 AuthFormComponent 组件 <ng-content> 所在区域。

#select 属性
投影多个内容时<ng-content> 指令为我们提供了 select 属性来设定投射的内容。
```
import { Component, Output, EventEmitter } from "@angular/core";

import { User } from "./auth-form.interface";

@Component({
  selector: "auth-form",
  template: `
    <div>
      <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
        <ng-content select="h3"></ng-content>
        <label>
          邮箱
          <input type="email" name="email" ngModel>
        </label>
        <label>
          密码
          <input type="password" name="password" ngModel>
        </label>
        <ng-content select="button"></ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent {
 // ...
}
```
select 属性支持 CSS 选择器（my-element，.my-class，[my-attribute]，…）来匹配你想要的内容。如果 ng-content 上没有设置 select 属性，它将接收全部内容，或接收不匹配任何其他 ng-content 元素的内容。

#组件投影
 ng-content 指令除了支持标准的 HTML 标签外，还支持自定义指令。为了演示这个特性，我们先来新建一个 AuthRememberComponent 组件：
 ```
 import { Component, Output, EventEmitter } from '@angular/core';
 
 @Component({
   selector: 'auth-remember',
   template: `
     <label>
       <input type="checkbox" (change)="onChecked($event.target.checked)">
       Keep me logged in
     </label>
   `
 })
 export class AuthRememberComponent {
 
   @Output() checked: EventEmitter<boolean> = new EventEmitter<boolean>();
 
   onChecked(value: boolean) {
     this.checked.emit(value);
   }
 }
 ```
 接着我们来更新一下 AuthFormComponent 组件：
 ```
 @Component({
   selector: 'auth-form',
   template: `
     <div>
       <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
         <ng-content select="h3"></ng-content>
         <label>
           邮箱
           <input type="email" name="email" ngModel>
         </label>
         <label>
           密码
           <input type="password" name="password" ngModel>
         </label>
         <ng-content select="auth-remember"></ng-content>
         <ng-content select="button"></ng-content>
       </form>
     </div>
   `
 })
 export class AuthFormComponent {
  // ...
 }
 ```
 在 AuthFormComponent 组件模板中，我们新增了一行 <ng-content select="auth-remember"></ng-content>，用来设置投影的内容。
 
 
 #ContentChild
  上面我们已经介绍了内容投射的相关概念及 <ng-content> 指令的常见用法。下面我们来介绍在组件内部，如何获取 <ng-content> 投射的内容。
  
  在 Angular 中提供了 ContentChild 装饰器来获取投影的元素。
  
 ```
 @Component({
   selector: "auth-form",
   template: `
     <div>
       <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
         <ng-content select="h3"></ng-content>
         <label>
           Email address
           <input type="email" name="email" ngModel>
         </label>
         <label>
           Password
           <input type="password" name="password" ngModel>
         </label>
         <ng-content select="auth-remember"></ng-content>
         <div *ngIf="showMessage">
           保持登录状态30天
         </div>
         <ng-content select="button"></ng-content>
       </form>
     </div>
   `
 })
 export class AuthFormComponent implements AfterContentInit {
   showMessage: boolean;
 
   @ContentChild(AuthRememberComponent) remember: AuthRememberComponent;
   
   ngAfterContentInit() {
     if (this.remember) {
       this.remember.checked.subscribe(
         (checked: boolean) => (this.showMessage = checked)
       );
     }
   }
   // ...
 }
 ```
 以上示例中，我们通过 ContentChild(AuthRememberComponent) 来设置获取的组件类型，此外我们在生命周期钩子 ngAfterContentInit 中通过订阅 remember 的 checked 输出属性来监听 checkbox 输入框的变化。同时根据 AuthRememberComponent 组件中 checkbox 的值来控制是否显示 ”保持登录30天“ 的提示消息。
 
 #ContentChildren
 除了 ContentChild 装饰器之外，Angular 还为我们提供了一个 ContentChildren 装饰器，用来从通过 Content Projection 方式设置的视图中获取匹配的多个元素，返回的结果是一个 QueryList 集合。
 
 为了能获取多个元素，首先我们需要更新一下 AppComponent 组件，即我们在模板中新增两个 AuthRememberComponent 组件，具体如下：
 ```
 @Component({
   selector: "app-root",
   template: `
     <div>
       <auth-form 
         (submitted)="createUser($event)">
         <h3>注册</h3>
         <button type="submit">
           注册
         </button>
       </auth-form>
       <auth-form 
         (submitted)="loginUser($event)">
         <h3>登录</h3>
         <auth-remember (checked)="rememberUser($event)"></auth-remember>
         <auth-remember (checked)="rememberUser($event)"></auth-remember>
         <auth-remember (checked)="rememberUser($event)"></auth-remember>
         <button type="submit">
           登录
         </button>
       </auth-form>
     </div>
   `
 })
 export class AppComponent {
   // ...
 }
 ```
 接着我们需要在 AuthFormComponent 组件中引入 ContentChildren 装饰器，更新后的 AuthFormComponent 组件如下：
 ```
 import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
 
 import { AuthRememberComponent } from './auth-remember.component';
 
 import { User } from './auth-form.interface';
 
 @Component({
   selector: 'auth-form',
   template: `
     <div>
       <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
         <ng-content select="h3"></ng-content>
         <label>
           邮箱
           <input type="email" name="email" ngModel>
         </label>
         <label>
           密码
           <input type="password" name="password" ngModel>
         </label>
         <ng-content select="auth-remember"></ng-content>
         <div *ngIf="showMessage">
           保持登录30天
         </div>
         <ng-content select="button"></ng-content>
       </form>
     </div>
   `
 })
 export class AuthFormComponent implements AfterContentInit {
 
   showMessage: boolean;
 
   @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;
 
   @Output() submitted: EventEmitter<User> = new EventEmitter<User>();
 
   ngAfterContentInit() {
     if (this.remember) {
       this.remember.forEach((item) => {
         item.checked.subscribe((checked: boolean) => this.showMessage = checked);
       });
     }
   }
   
   // ...
 }
 ```
 
 在上面的示例中，ContentChildren 装饰器返回的是一个 QueryList 集合，在 ngAfterContentInit 生命周期钩子中，我们通过 QueryList 实例提供的 forEach 方法来遍历集合中的元素。QueryList 实例除了提供 forEach() 方法之外，它还提供了数组常用的方法，比如 map()、filter()、find()、some() 和 reduce() 等方法。
 
 #ngProjectAs
 有时候我们的定义的组件可能会包含在其它容器中，比如 <ng-container> ，这时我们的目标投影会发生什么：
 ```
 <ng-container>
    <auth-remember (checked)="rememberUser($event)"></auth-remember>
 </ng-container>
 ```
 
 当你刷新页面的时候，你会发现 AuthRememberComponent 组件已经消失了。因为 ng-container 容器不再匹配 select="auth-remember"。为了解决这个问题，我们必须使用 ngProjectAs 属性，它可以应用于任何元素上。使用方式如下：
 
 ```
 <ng-container ngProjectAs="auth-remember">
    <auth-remember (checked)="rememberUser($event)"></auth-remember>
 </ng-container>
 ```
 通过设置 ngProjectAs 属性，终于重新找回了我们的 AuthRememberComponent 组件。
 
 #总结
 <ng-content> 不会 “产生” 内容，它只是投影现有的内容。你可以认为它等价于 node.appendChild(el)或 jQuery 中的 $(node).append(el) 方法：使用这些方法，节点不被克隆，它被简单地移动到它的新位置。因此，投影内容的生命周期将被绑定到它被声明的地方，而不是显示在地方。
 
 这种行为有两个原因：期望一致性和性能。什么 “期望的一致性” 意味着作为开发人员，可以基于应用程序的代码，猜测其行为。假设我写了以下代码：
 
```
<div class="my-wrapper">
  <counter></counter>
</div>
```
很显然计数器将被实例化一次，但现在假如我们使用第三方库的组件：
```
<third-party-wrapper>
  <counter></counter>
</third-party-wrapper>
```

如果第三方库能够控制 counter 组件的生命周期，我将无法知道它被实例化了多少次。其中唯一方法就是查看第三方库的代码，了解它们的内部处理逻辑。将组件的生命周期被绑定到我们的应用程序组件而不是包装器的意义是，开发者可以掌控计数器只被实例化一次，而不用了解第三方库的内部代码。

性能的原因更为重要。因为 ng-content 只是移动元素，所以可以在编译时完成，而不是在运行时，这大大减少了实际应用程序的工作量。
