#Observer Pattern
观察者模式是软件设计模式的一种。在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。

观察者模式又叫发布订阅模式（Publish/Subscribe），它定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使得它们能够自动更新自己。

我们可以使用日常生活中，期刊订阅的例子来形象地解释一下上面的概念。期刊订阅包含两个主要的角色：期刊出版方和订阅者，他们之间的关系如下：

- 期刊出版方 - 负责期刊的出版和发行工作
- 订阅者 - 只需执行订阅操作，新版的期刊发布后，就会主动收到通知，如果取消订阅，以后就不会再收到通知
在观察者模式中也有两个主要角色：Subject (主题) 和 Observer (观察者) 。它们分别对应例子中的期刊出版方和订阅者。

**观察者模式优缺点**
观察者模式的优点：

支持简单的广播通信，自动通知所有已经订阅过的对象<br>
目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用<br>

**观察者模式的缺点**：

如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间 <br>
如果在观察者和观察目标之间有循环依赖的话，观察目标会触发它们之间进行循环调用，可能导致系统崩溃<br>

#观察者模式的应用

在前端领域，观察者模式被广泛地使用。最常见的例子就是为 DOM 对象添加事件监听，具体示例如下：
```
<button id="btn">确认</button>

function clickHandler(event) {
	console.log('用户已点击确认按钮!');
}
document.getElementById("btn").addEventListener('click', clickHandler);
```

上面代码中，我们通过 addEventListener API 监听 button 对象上的点击事件，当用户点击按钮时，会自动执行我们的 clickHandler 函数。


#观察者模式实战

Subject 类定义：
```
class Subject {
    
    constructor() {
        this.observerCollection = [];
    }
    
    registerObserver(observer) {
        this.observerCollection.push(observer);
    }
    
    unregisterObserver(observer) {
        let index = this.observerCollection.indexOf(observer);
        if(index >= 0) this.observerCollection.splice(index, 1);
    }
    
    notifyObservers() {
        this.observerCollection.forEach((observer)=>observer.notify());
    }
}
```
Observer 类定义：
```
class Observer {
    
    constructor(name) {
        this.name = name;
    }
    
    notify() {
        console.log(`${this.name} has been notified.`);
    }
}
```

使用示例：
```
let subject = new Subject(); // 创建主题对象

let observer1 = new Observer('semlinker'); // 创建观察者A - 'semlinker'
let observer2 = new Observer('lolo'); // 创建观察者B - 'lolo'

subject.registerObserver(observer1); // 注册观察者A
subject.registerObserver(observer2); // 注册观察者B
 
subject.notifyObservers(); // 通知观察者

subject.unregisterObserver(observer1); // 移除观察者A

subject.notifyObservers(); // 验证是否成功移除
```

#Iterator Pattern
**迭代器模式定义**

迭代器（Iterator）模式，又叫做游标（Cursor）模式。它提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

**迭代器模式的优缺点**

迭代器模式的优点：

- 简化了遍历方式，对于对象集合的遍历，还是比较麻烦的，对于数组或者有序列表，我们尚可以通过游标取得，但用户需要在对集合了解的前提下，自行遍历对象，但是对于 hash 表来说，用户遍历起来就比较麻烦。而引入迭代器方法后，用户用起来就简单的多了。
- 封装性良好，用户只需要得到迭代器就可以遍历，而不用去关心遍历算法。

迭代器模式的缺点：

遍历过程是一个单向且不可逆的遍历


#ES 5 迭代器
接下来我们来创建一个 makeIterator 函数，该函数的参数类型是数组，当调用该函数后，返回一个包含 next() 方法的 Iterator 对象， 其中 next() 方法是用来获取容器对象中下一个元素。具体示例如下：

```
function makeIterator(array){
    var nextIndex = 0;
    
    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
}
```

一旦初始化, next() 方法可以用来依次访问可迭代对象中的元素：
```
var it = makeIterator(['yo', 'ya']);
console.log(it.next().value); // 'yo'
console.log(it.next().value); // 'ya'
console.log(it.next().done);  // true
```

# ES 6 迭代器

在 ES 6 中我们可以通过 Symbol.iterator 来创建可迭代对象的内部迭代器，具体示例如下
```
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();
```
调用 next() 方法来获取数组中的元素：

```
> iter.next()
{ value: 'a', done: false }
> iter.next()
{ value: 'b', done: false }
> iter.next()
{ value: 'c', done: false }
> iter.next()
{ value: undefined, done: true }
```

ES 6 中可迭代的对象：

- Arrays
- Strings
- Maps
- Sets
- DOM data structures (work in progress)


#Observable

RxJS 是基于观察者模式和迭代器模式以函数式编程思维来实现的。RxJS 中含有两个基本概念：Observables 与 Observer。Observables 作为被观察者，是一个值或事件的流集合；而 Observer 则作为观察者，根据 Observables 进行处理。

Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下：

- 订阅：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
- 发布：Observable 通过回调 next 方法向 Observer 发布事件。

# 自定义 Observable

如果你想真正了解 Observable，最好的方式就是自己写一个。其实 Observable 就是一个函数，它接受一个 Observer 作为参数然后返回另一个函数。

它的基本特征：

- 是一个函数
- 接受一个 Observer 对象 (包含 next、error、complete 方法的对象) 作为参数
- 返回一个 unsubscribe 函数，用于取消订阅

它的作用：

作为生产者与观察者之间的桥梁，并返回一种方法来解除生产者与观察者之间的联系，其中观察者用于处理时间序列上数据流。接下来我们来看一下 Observable 的基础实现：

DataSource - 数据源

```
class DataSource {
  constructor() {
    let i = 0;
    this._id = setInterval(() => this.emit(i++), 200); // 创建定时器
  }
  
  emit(n) {
    const limit = 10;  // 设置数据上限值
    if (this.ondata) {
      this.ondata(n);
    }
    if (n === limit) {
      if (this.oncomplete) {
        this.oncomplete();
      }
      this.destroy();
    }
  }
  
  destroy() { // 清除定时器
    clearInterval(this._id);
  }
}
```

myObservable
```
function myObservable(observer) {
    let datasource = new DataSource(); // 创建数据源
    datasource.ondata = (e) => observer.next(e); // 处理数据流
    datasource.onerror = (err) => observer.error(err); // 处理异常
    datasource.oncomplete = () => observer.complete(); // 处理数据流终止
    return () => { // 返回一个函数用于，销毁数据源
        datasource.destroy();
    };
}
```
使用示例：

```
const unsub = myObservable({
  next(x) { console.log(x); },
  error(err) { console.error(err); },
  complete() { console.log('done')}
});

/**
* 移除注释，可以测试取消订阅
*/
// setTimeout(unsub, 500);
```


# SafeObserver - 更好的 Observer
上面的示例中，我们使用一个包含了 next、error、complete 方法的普通 JavaScript 对象来定义观察者。一个普通的 JavaScript 对象只是一个开始，在 RxJS 5 里面，为开发者提供了一些保障机制，来保证一个更安全的观察者。以下是一些比较重要的原则：

- 传入的 Observer 对象可以不实现所有规定的方法 (next、error、complete 方法)
- 在 complete 或者 error 触发之后再调用 next 方法是没用的
- 调用 unsubscribe 方法后，任何方法都不能再被调用了
- complete 和 error 触发后，unsubscribe 也会自动调用
- 当 next、complete和error 出现异常时，unsubscribe 也会自动调用以保证资源不会浪费
- next、complete和error是可选的。按需处理即可，不必全部处理

为了完成上述目标，我们得把传入的匿名 Observer 对象封装在一个 SafeObserver 里以提供上述保障。SafeObserver 的具体实现如下：
```
class SafeObserver {
  constructor(destination) {
    this.destination = destination;
  }
  
  next(value) {
    // 尚未取消订阅，且包含next方法
    if (!this.isUnsubscribed && this.destination.next) {
      try {
        this.destination.next(value);
      } catch (err) {
        // 出现异常时，取消订阅释放资源，再抛出异常
        this.unsubscribe();
        throw err;
      }
    }
  }
  
  error(err) {
    // 尚未取消订阅，且包含error方法
    if (!this.isUnsubscribed && this.destination.error) {
      try {
        this.destination.error(err);
      } catch (e2) {
        // 出现异常时，取消订阅释放资源，再抛出异常
        this.unsubscribe();
        throw e2;
      }
      this.unsubscribe();
    }
  }

  complete() {
    // 尚未取消订阅，且包含complete方法
    if (!this.isUnsubscribed && this.destination.complete) {
      try {
        this.destination.complete();
      } catch (err) {
        // 出现异常时，取消订阅释放资源，再抛出异常
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe();
    }
  }
  
  unsubscribe() { // 用于取消订阅
    this.isUnsubscribed = true;
    if (this.unsub) {
      this.unsub();
    }
  }
}
```

#Operators - 也是函数
 Operator 是一个函数，它接收一个 Observable 对象，然后返回一个新的 Observable 对象。当我们订阅新返回的 Observable 对象时，它内部会自动订阅前一个 Observable 对象。接下来我们来实现常用的 map 操作符：
 ```
 // 数据源
   class DataSource {
     constructor() {
       let i = 0;
       this._id = setInterval(() => this.emit(i++), 200); // 创建定时器
     }
 
     emit(n) {
       const limit = 10;
       if (this.ondata) {
         this.ondata(n);
       }
       if (n === limit) {
         if (this.oncomplete) {
           this.oncomplete();
         }
         this.destroy();
       }
     }
     destroy() {
       clearInterval(this._id);
     }
  }

 class SafeObserver {
  constructor(destination) {
    this.destination = destination;
  }

  next(value) {
    // 尚未取消订阅，且包含error方法
    if (!this.isUnsubscribed && this.destination.error) {
      try {
        this.destination.next(value);
      } catch (err) {  // 出现异常时，取消订阅释放资源，再抛出异常
        this.unsubscribe();
        throw err;
      }
      // this.unsubscribe();
    }
  }

  complete() {
    // 尚未取消订阅，且包含complete方法
    if (!this.isUnsubscribed && this.destination.complete) {
      try {
        this.destination.complete();
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe();
    }
  }

  // 用于取消订阅
  unsubscribe() {
    this.isUnsubscribed = true;
    if (this.unsub) {
      this.unsub();
    }
  }
}

// 这个类是重点
class Observable {
   constructor(_subscribe) {
     this._subscribe = _subscribe;
   }

   subscribe(observer) {
     const safeObserver = new SafeObserver(observer);
     safeObserver.unsub = this._subscribe(safeObserver);
     return safeObserver.unsubscribe.bind(safeObserver);
   }

}

 // map 操作符实现：
function map(source, project) {
  return new Observable(observer => {
    const mapObserver = {
      next: (x) => observer.next(project(x)),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    };
    return source.subscribe(mapObserver);
  })
}


var myObserver = new Observable((safeObs) => {
  const dataSource = new DataSource();
  dataSource.ondata = e => safeObs.next(e);
  dataSource.oncomplete = () => safeObs.complete();
  return () => dataSource.destroy();
})

// 用法
 map(myObserver, (x) => x + x).subscribe({
   next(x) { console.log(x); },
   error(err) { console.error(err); },
   complete() { console.log('done')}
 });
```

#改进 Observable - 支持 Operator 链式调用
如果把 Operator 都写成如上那种独立的函数，我们链式代码会逐渐变丑
```
map(map(myObservable, (x) => x + 1), (x) => x + 2);
```
对于上面的代码，想象一下有 5、6 个嵌套着的 Operator，再加上更多、更复杂的参数，基本上就没法儿看了。

你也可以试下 Texas Toland 提议的简单版管道实现，合并压缩一个数组的Operator并生成一个最终的Observable，不过这意味着要写更复杂的 Operator。其实写完后你会发现，代码也不怎么漂亮：
```
pipe(myObservable, map(x => x + 1), map(x => x + 2));
```
理想情况下，我们想将代码用更自然的方式链起来：
```
myObservable.map(x => x + 1).map(x => x + 2);
```
幸运的是，我们已经有了这样一个 Observable 类，我们可以基于 prototype 在不增加复杂度的情况下支持多 Operators 的链式结构，下面我们采用prototype方式再次实现一下 Observable：
```
Observable.prototype.map = function (project) {
    return new Observable((observer) => {
        const mapObserver = {
            next: (x) => observer.next(project(x)),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        };
        return this.subscribe(mapObserver);
    });
};
```
#热和冷
**Hot Observable**

Hot Observable 无论有没有 Subscriber 订阅，事件始终都会发生。当 Hot Observable 有多个订阅者时，Hot Observable 与订阅者们的关系是一对多的关系，可以与多个订阅者共享信息。
```
const socket = new WebSocket('ws://someurl');
const source = new Observable((observer) => {
  socket.addEventListener('message', (e) => observer.next(e));
});
```

**Cold Observable**

Cold Observable 只有 Subscriber 订阅时，才开始执行发射数据流的代码。并且 Cold Observable 和 Subscriber 只能是一对一的关系，当有多个不同的订阅者时，消息是重新完整发送的。也就是说对 Cold Observable 而言，有多个 Subscriber 的时候，他们各自的事件是独立的。
```
const source = new Observable((observer) => {
  const socket = new WebSocket('ws://someurl');
  socket.addEventListener('message', (e) => observer.next(e));
  return () => socket.close();
});
```

一个 Observable 是 Hot 还是 Cold，都是相对于生产者而言的，如果每次订阅的时候，外部的生产者已经创建好了，那就是 Hot Observable，反之，如果每次订阅的时候都会产生一个新的生产者，那就是 Cold Observable。

#Pull vs Push
Pull 和 Push 是数据生产者和数据的消费者两种不同的交流方式。

**什么是Pull?**

在 “拉” 体系中，数据的消费者决定何时从数据生产者那里获取数据，而生产者自身并不会意识到什么时候数据将会被发送给消费者。

每一个 JavaScript 函数都是一个 “拉” 体系，函数是数据的生产者，调用函数的代码通过 ‘’拉出” 一个单一的返回值来消费该数据。
```
const add = (a, b) => a + b;
let sum = add(3, 4);
```
ES6介绍了 iterator迭代器 和 Generator生成器 — 另一种 “拉” 体系，调用 iterator.next() 的代码是消费者，可从中拉取多个值。

**什么是Push？**

在 “推” 体系中，数据的生产者决定何时发送数据给消费者，消费者不会在接收数据之前意识到它将要接收这个数据。

Promise(承诺) 是当今 JS 中最常见的 “推” 体系，一个Promise (数据的生产者)发送一个 resolved value (成功状态的值)来执行一个回调(数据消费者)，但是不同于函数的地方的是：Promise 决定着何时数据才被推送至这个回调函数。

RxJS 引入了 Observables (可观察对象)，一个全新的 “推” 体系。一个可观察对象是一个产生多值的生产者，当产生新数据的时候，会主动 “推送给” Observer (观察者)

|        | 生产者	            | 消费者              |
---------| -------------------|--------------------
| pull拉  | 被请求的时候产生数据	| 决定何时请求数据      |
| push推	 | 按自己的节奏生产数据	| 对接收的数据进行处理  |


#Observable vs Promise
Observable（可观察对象）是基于推送（Push）运行时执行（lazy）的多值集合。

|  MagicQ    | 单值	            | 多值              |
---------    | -----------------|-------------------
| 拉取(Pull)  | 函数	            | 遍历器            |
| 推送(Push)	 | Promise	        | Observable        |


**Promise:**
- 返回单个值
- 不可取消的

**Observable:**
- 随着时间的推移发出多个值
- 可以取消的
- 支持 map、filter、reduce 等操作符
- 延迟执行，当订阅的时候才会开始执行

#延迟计算 & 渐进式取值

**延迟计算**

所有的 Observable 对象一定会等到订阅后，才开始执行，如果没有订阅就不会执行。
```
import { from } from "rxjs";
import { map } from "rxjs/operators";

const source$ = from([1, 2, 3, 4, 5]);
const example$ = source$.pipe(map(x => x + 1));
```
上面的示例中，因为 example$ 对象还未被订阅，所以不会进行运算。这跟数组不一样，具体如下：
```
const source = [1,2,3,4,5];
const example = source.map(x => x + 1);
```
以上代码运行后，example 中就包含已运算后的值。

**渐进式取值**

数组中的操作符如：filter、map 每次都会完整执行并返回一个新的数组，才会继续下一步运算。具体示例如下：
```
const source = [1,2,3,4,5];
const example = source
				.filter(x => x % 2 === 0) // [2, 4]
              	.map(x => x + 1) // [3, 5]
```
关于数组中的 map、filter 的详细信息，可以阅读 - [RxJS Functional Programming](https://segmentfault.com/a/1190000008794344)<br>

为了更好地理解数组操作符的运算过程，我们可以查看 [Array Compute](http://cdn.semlinker.com/array-compute.gif)。<br>

虽然 Observable 运算符每次都会返回一个新的 Observable 对象，但每个元素都是渐进式获取的，且每个元素都会经过操作符链的运算后才输出，而不会像数组那样，每个阶段都得完整运算。具体示例如下：
```
import { from } from "rxjs";
import { filter, map } from "rxjs/operators";

const source$ = from([1, 2, 3, 4, 5]);
const example$ = source$.pipe(
  filter(x => x % 2 === 0),
  map(x => x + 1)
);

example$.subscribe(console.log);
```
以上代码的输出结果：
```
3
5
```
为了更好地理解 Observable 操作符的运算过程，我们可以参考 [Observable Compute](http://cdn.semlinker.com/observable-compute.gif)。
