# 父组件改变数据时 子组件ts时刻监听到数据

**父组件**
```
    <input [(ngModel)]="data">
    <app-child [childData]="data"></app-child>
```

**子组件**
```
     @Input("childData") 
     set test(data) {
        console.log(data)
     };
```