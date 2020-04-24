#指令

**做一个和*ngIf相反的指令**

```
html:
<div *noIf="false">
  我是和If相反的指令
</div>

ts:
@Input('noIf')
  set content (value: boolean) {
    if (!value) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }  else {
      this.viewContainer.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }

```


**createEmbeddedView()方法，创建内嵌视图**

```
  html:
  <ng-template #tmp>
    我是一个模版
  </ng-template>
  
  ts:
   @ViewChild('tmp') tmpRef: TemplateRef<any>;
  
    constructor(private vcRef: ViewContainerRef) { }
  
    ngAfterViewInit(): void {
      this.vcRef.createEmbeddedView(this.tmpRef);
    }
```

**ngTemplateOutlet内嵌视图**
```
<div [ngTemplateOutlet] = "tmp"></div>
```
createEmbeddedView()方法内嵌的视图不在当前的组件里面


```
html:
<ng-template #atpl let-msg="message">
  <p>{{msg}}</p>
</ng-template>

<div [ngTemplateOutlet]="atpl"
     [ngTemplateOutletContext]="context">
</div>



<ng-template #otpl let-msg>
  <p>{{msg}}</p>
</ng-template>

<div [ngTemplateOutlet]="otpl"
     [ngTemplateOutletContext]="context">
</div>

ts:
context = {
    message: 'Hello ngOutletContext!',
    $implicit: '我是默认的!'
  };

```

**ngComponentOutlet 的使用:**
```
简写：
<ng-container *ngComponentOutlet="child"></ng-container>

完整写法：
<ng-container *ngComponentOutlet="child;
   injector: injectorExpression;
   content: contentNodesExpression;">
</ng-container>

ts:
child = ChildComponent;
```

*ngFor遍历的各方法
```
<li *ngFor="let item of items; index as i; first as first; last as last; even as even;odd as odd; trackBy: trackByFn">...</li>
```
trackBy的值是函数


**resolveComponentFactory 动态加载组件**
```
  html：
  <ng-container #vc><ng-container>
  
  ts：
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  componentRef: ComponentRef<any>;
  
  constructor(
    private cfr: ComponentFactoryResolver,
  ) { }
  
  ngOnInit() {
    const factory = this.cfr.resolveComponentFactory(ChildComponent); // 创建组件工厂
    this.componentRef = this.vc.createComponent(factory); // 创建组件引用
    this.componentRef.instance.data = {a: 1, b: 2, c: 3};
  }
  
  ngAfterViewChecked(): void {
    if (this.componentRef) {
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }
  
  内嵌组件接收数据：
  @Input() data = {name: '我是子组件'}
```
