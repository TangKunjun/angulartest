#ViewChild

Angular 为我们提供 ViewChild 和 ViewChildren 装饰器来获取模板视图中匹配的元素。ViewChild 是属性装饰器，用来从模板视图中获取匹配的元素。视图查询在 ngAfterViewInit 钩子函数调用前完成，因此在 ngAfterViewInit 钩子函数中，就能正常获取查询的元素。

AuthMessageComponent 组件：
```
import { Component } from "@angular/core";

@Component({
  selector: "auth-message",
  template: `
    <div>
      保持登录 {{ days }} 天
    </div>
  `
})
export class AuthMessageComponent {
  days: number = 7;
}
```

创建完 AuthMessageComponent 组件，我们需要同步更新一下 AuthFormComponent 组件，具体如下：
```
import { Component, Output, EventEmitter, ContentChildren, ViewChild, QueryList, AfterContentInit, AfterViewInit } from '@angular/core';

import { AuthRememberComponent } from './auth-remember.component';
import { AuthMessageComponent } from './auth-message.component';

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
        <auth-message 
          [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <ng-content select="button"></ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent implements AfterContentInit, AfterViewInit {

  showMessage: boolean;

  @ViewChild(AuthMessageComponent) message: AuthMessageComponent;

  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;

  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  ngAfterViewInit() {
    //this.message.days = 30;
  }

  ngAfterContentInit() {
    if (this.message) {
      this.message.days = 30;
    }
    if (this.remember) {
      this.remember.forEach((item) => {
        item.checked.subscribe((checked: boolean) => this.showMessage = checked);
      });
    }
  }
  
}
```

在上面示例中，我们通过 ViewChild 装饰器来获取 AuthRememberComponent 组件，此外我们在 ngAfterContentInit 生命周期钩子中重新设置天数。以上代码成功运行后，页面能够看到期望的结果。

但如果我们在 ngAfterViewInit 生命周期钩子中重新设置天数，那么在控制台将会抛出以下异常：
```
ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'null: 7'. Current value: 'null: 30'.
```


#ViewChildren
与 ContentChild 装饰器类似，ViewChild 装饰器也有与之对应的 ViewChildren 装饰。该装饰器用来从模板视图中获取匹配的多个元素，返回的结果是一个 QueryList 集合。

为了能获取多个匹配的元素，我们需要更新一下 AuthFormComponent 模板，即新增两个 AuthMessageComponent 组件：

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
        <auth-message 
          [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <auth-message 
          [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <auth-message 
          [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <ng-content select="button"></ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent implements AfterContentInit, AfterViewInit {

  showMessage: boolean;

  @ViewChildren(AuthMessageComponent) message: QueryList<AuthMessageComponent>;

  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;

  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.message) {
      this.message.forEach((message) => {
        message.days = 30;
      });
      this.cd.detectChanges();
    }
  }

  ngAfterContentInit() {
    if (this.remember) {
      this.remember.forEach((item) => {
        item.checked.subscribe((checked: boolean) => this.showMessage = checked);
      });
    }
  }
}
```
更新完对应的模板，我们也需要同步更新组件类，即引入 ContentChildren 装饰器，并且在 ngAfterViewInit 生命周期内更新 AuthMessageComponent 组件的 days 属性值。除了更新属性值之外，还执行了 this.cd.detectChanges()

#Viewchild 和 ElementRef

首先我们来设置模板引用：

```
<label>
   邮箱
   <input type="email" name="email" ngModel #email>
</label>
```
接下来更新 AuthFormComponent 组件类，使用 ViewChild 装饰器来获取邮箱输入框的元素引用：

```
@ViewChild('email') email: ElementRef

ngAfterViewInit() {
   console.log(this.email);
   if (this.message) {
     this.message.forEach((message) => {
       message.days = 30;
     });
     this.cd.detectChanges();
   }
}
```

在控制台中展开 nativeElement 属性，你会发现该属性对应的值是原生的 DOM 元素，因此我们可以在 ngAfterViewInit 生命周期钩子中执行某些 DOM 操作：


```
ngAfterViewInit() {
   this.email.nativeElement.setAttribute('placeholder', 'Enter your email address');
   this.email.nativeElement.classList.add('email');
   this.email.nativeElement.focus();
}
```
现在虽然我们已经能够正确获取原生的 DOM 元素，并能够进行相关的 DOM 操作。但在实际项目中，我们是不推荐直接使用 DOM API 执行 DOM 操作的，我们要尽量减少应用层与渲染层之间强耦合关系，从而让我们应用能够灵活地运行在不同环境。

为了能够支持跨平台，Angular 通过抽象层封装了不同平台的差异，统一了 API 接口。如定义了抽象类 Renderer2 、抽象类 RootRenderer 等。此外还定义了以下引用类型：ElementRef、TemplateRef、ViewRef 、ComponentRef 和 ViewContainerRef 等。

```
constructor(
   private cd: ChangeDetectorRef,
   private renderer: Renderer2) {
}

ngAfterViewInit() {
   this.renderer.setAttribute(this.email.nativeElement, 
     'placeholder', 'Enter your email address');
    this.renderer.addClass(this.email.nativeElement, 'email');
}
```
