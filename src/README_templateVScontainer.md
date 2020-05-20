通常情况下，当我们使用结构指令时，我们需要添加额外的标签来封装内容，如使用 *ngIf 指令
```
<section *ngIf="show">
 <div>
   <h2>Div one</h2>
 </div>
 <div>
   <h2>Div two</h2>
 </div>
</section>
```

上面示例中，我们在 section 标签上应用了 ngIf 指令，从而实现 section 标签内容的动态显示。这种方式有个问题是，我们必须添加额外的 DOM 元素。要解决该问题，我们可以使用 <ng-template> 的标准语法 （非*ngIf 语法糖）：

```
<ng-template [ngIf]="show">
 <div>
   <h2>Div one</h2>
 </div>
 <div>
   <h2>Div two</h2>
 </div>
</ng-template>
```
问题是解决了但我们不再使用 * 语法糖语法，这样会导致我们代码的不统一。虽然解决了问题，但又带来了新问题。那我们还有其它的方案么？答案是有的，我们可以使用 ng-container 指令。

#ng-container
<ng-container> 是一个逻辑容器，可用于对节点进行分组，它将被渲染为 HTML中的 comment 元素。具体示例如下

```
<ng-container *ngIf="show">
 <div>
   <h2>Div one</h2>
 </div>
  <div>
    <h2>Div two</h2>
  </div>
</ng-container>
```

有时我们需要根据 switch 语句，动态显示文本，这时我们需要添加一个额外的标签如 <span> ，比如
```
<div [ngSwitch]="value">
  <span *ngSwitchCase="0">Text one</span>
  <span *ngSwitchCase="1">Text two</span>
</div>
```
针对这种情况，理论上我们是不需要添加额外的 <span> 标签，这时我们可以使用 ng-container 来解决这个问题：
```
<div [ngSwitch]="value">
 <ng-container *ngSwitchCase="0">Text one</ng-container>
 <ng-container *ngSwitchCase="1">Text two</ng-container>
</div>
```

此外 Angular 的初学者，可能会在某个标签上同时使用 *ngIf 或 *ngFor 指令，比如：
```
<div class="lesson" *ngIf="lessons" *ngFor="let lesson of lessons">
    <div class="lesson-detail">
        {{lesson | json}}
    </div>
</div>
```
当以上代码运行后，你将会看到以下报错信息：
```
Uncaught Error: Template parse errors:
Can't have multiple template bindings on one element. Use only one attribute 
named 'template' or prefixed with *
```
这意味着不可能将两个结构指令应用于同一个元素。要解决这个问题，我可以就利用 ng-container ：
```
<ng-container *ngIf="lessons">
    <div class="lesson" *ngFor="let lesson of lessons">
        <div class="lesson-detail">
            {{lesson | json}}
        </div>
    </div>
</ng-container>
```

#ng-template vs ng-container介绍完
ng-container 指令，我们来分析一下它跟 ng-template 指令有什么区别？我们先看以下示例：

```
<ng-template>
    <p> In template, no attributes. </p>
</ng-template>

<ng-container>
    <p> In ng-container, no attributes. </p>
</ng-container>
```
以上代码运行后，浏览器中输出结果是：
```
In ng-container, no attributes.
```
即 <ng-template> 中的内容不会显示。当在上面的模板中应用 ngIf 指令：
```
<ng-template [ngIf]="true">
   <p> ngIf with a template.</p>
</ng-template>

<ng-container *ngIf="true">
   <p> ngIf with an ng-container.</p>
</ng-container>
```
以上代码运行后，浏览器中输出结果是：
```
ngIf with a template.
ngIf with an ng-container.
```

最后我们来总结一下 <ng-template> 和 <ng-container> 的区别：
- <ng-template> ：使用 * 语法糖的结构指令，最终都会转换为 <ng-template> 或 <template> 模板指令，模板内的内容如果不进行处理，是不会在页面中显示的。
- <ng-container>：是一个逻辑容器，可用于对节点进行分组，它将被渲染为 HTML中的 comment 元素，它可用于避免添加额外的元素来使用结构指令。
