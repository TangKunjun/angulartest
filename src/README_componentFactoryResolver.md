# componentFactoryResolver

内嵌组件

**父组件**

ts文件
```
    @ViewChild('child', {read: ViewContainerRef}) child: ViewContainerRef;
    
    
    componentRef: ComponentRef<any>
    
    constructor(
        private resolver: ComponentFactoryResolver,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    const factory = this.resolver.resolveComponentFactory(this.data.contentComponent);
    this.componentRef = this.entryPoint.createComponent(factory) as ComponentRef<any>;
    
    this.componentRef.instance.data = this.data.data
    
    ngAfterViewChecked(): void {
        if(this.componentRef) {
            this.compontRef.changeDetectorRef.detectChanges();
        }
    }
    
    async confirmClick() {
        if (this.componentRef.instance.submit) {
            await this.componentRef.instance.submit();
        }
    }
```


子组件接收父组件的数据
```
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
```