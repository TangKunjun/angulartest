#provider 的multi属性
Multi provider 让我们可以使用相同的 Token 去注册多个 Provider 
```
const SOME_TOKEN: InjectionToken<Array<string>> = new InjectionToken("很多token");

const injector = Injector.create([
  {provide: SOME_TOKEN, useValue: '我是第一个', multi: true},
  {provide: SOME_TOKEN, useValue: '我是第2个', multi: true},
])

const dep = injector.get(SOME_TOKEN);
console.log(dep);
```
上面的代码返回数组，值是两个useValue的值，如果去掉multi返回的是"我是第2个"回被覆盖 <br>
我们使用 multi: true 告诉 Angular 的依赖注入系统，我们设置的 provider 是 multi provider。正如之前所说，我们可以使用相同的 token 值，注册不同的 provider。当我们使用对应的 token 去获取依赖项时，我们获取的是已注册的依赖对象列表。
<b>另外需要注意的是，multi provider 是不能和普通的 provider 混用。</b>


#APP_INITIALIZER
APP_INITIALIZER 的定义如下：
```
export const APP_INITIALIZER = new InjectionToken<Array<() => void>>('Application   Initializer');
```
通过以上的定义，我们知道 APP_INITIALIZER Token 所对应的依赖对象是数组对象，数组中保存的元素是函数对象。这表示我们可以定义多个初始化逻辑，那么现在问题来了，我们自定义的初始化逻辑是什么被运行呢？

在 Angular 内部定义了一个 ApplicationInitStatus 类：
```
// packages/core/src/application_init.ts
@Injectable()
export class ApplicationInitStatus {
  // TODO(issue/24571): remove '!'.
  private resolve !: Function;
  // TODO(issue/24571): remove '!'.
  private reject !: Function;
  private initialized = false;
  public readonly donePromise: Promise<any>;
  public readonly done = false;

  constructor(@Inject(APP_INITIALIZER) @Optional() private appInits: (() => any)[]) {
    this.donePromise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }

  /** @internal */
  runInitializers() {
    if (this.initialized) {
      return;
    }

    const asyncInitPromises: Promise<any>[] = [];

    const complete = () => {
      (this as{done: boolean}).done = true;
      this.resolve();
    };

    if (this.appInits) {
      for (let i = 0; i < this.appInits.length; i++) {
        const initResult = this.appInits[i]();
        if (isPromise(initResult)) {
          asyncInitPromises.push(initResult);
        }
      }
    }

    Promise.all(asyncInitPromises).then(() => { complete(); })
        .catch(e => { this.reject(e); });

    if (asyncInitPromises.length === 0) {
      complete();
    }
    this.initialized = true;
  }
}
```
在 ApplicationInitStatus 类内部，通过 Angular 的 DI 机制注入了 APP_INITIALIZER 对应的依赖对象。此外在该类内部定义了一个 runInitializers() 方法，因为 APP_INITIALIZER 对应的依赖对象类型是 Array<() => void> ，所以在 runInitializers() 方法内部，通过 for 循环来遍历系统定义的初始化函数：
```
if (this.appInits) {
   for (let i = 0; i < this.appInits.length; i++) {
     const initResult = this.appInits[i]();
       if (isPromise(initResult)) {
          asyncInitPromises.push(initResult);
       }
   }
}
```
通过以上代码可知，当我们定义的初始化函数执行后返回的是一个 Promise 对象时，它会被保存到 asyncInitPromises: Promise<any>[] 数组对象中，此后 Angular 会等待所有的异步任务都执行完成才认为初始化完成：
```
 Promise.all(asyncInitPromises).then(() => { complete(); })
     .catch(e => { this.reject(e); });

if (asyncInitPromises.length === 0) {
   complete();
}
this.initialized = true;
```

#APP_INITIALIZER 实战
```
{
  provide: APP_INITIALIZER,
  useFactory: () => {
    return () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('APP_INITIALIZER执行后再执行其他');
          resolve();
        }, 4000);
      });
    };
  },
  multi: true
}
```

需要注意的事，上面的示例只是为了演示需要。在工作中使用的是 Ionic 框架，在框架内部也是通过 APP_INITIALIZER 定义 multi provider 实现自定义初始化操作，眼见为实（Ionic 4.0.0 beta3）：

```
// ionic-4.0.0-beta.3/angular/src/ionic-module.ts
@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  providers: [p.AngularDelegate, p.ModalController, p.PopoverController],
  imports: [CommonModule]
})
export class IonicModule {
  static forRoot(config?: IonicConfig): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true,
          deps: [
            ConfigToken
          ]
        },
        ...PROVIDERS
      ]
    };
  }
}
```
最后我们来看一下 appInitialize 函数：
```
export function appInitialize(config: Config) {
  return () => {
    const win: IonicWindow = window as any;
    if (typeof win !== 'undefined') {
      const Ionic = win.Ionic = win.Ionic || {};

      Ionic.config = config;

      Ionic.ael = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__addEventListener) {
          elm.__zone_symbol__addEventListener(eventName, cb, opts);
        } else {
          elm.addEventListener(eventName, cb, opts);
        }
      };

      Ionic.rel = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__removeEventListener) {
          elm.__zone_symbol__removeEventListener(eventName, cb, opts);
        } else {
          elm.removeEventListener(eventName, cb, opts);
        }
      };

      Ionic.raf = (cb: any) => {
        if (win.__zone_symbol__requestAnimationFrame) {
          win.__zone_symbol__requestAnimationFrame(cb);
        } else {
          win.requestAnimationFrame(cb);
        }
      };

      // define all of Ionic's custom elements
      defineCustomElements(win);
    }
  };
}
```
在 appInitialize() 方法内部，主要执行以下的操作：

设置全局的 Ionic 对象及初始化 Ionic 对象内部的 config 属性；
- 定义ael（addEventListener）、rel（removeEventListener）、raf（requestAnimationFrame）方法；
- 定义 Ionic 内部所有的自定义元素。
