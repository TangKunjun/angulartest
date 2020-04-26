#Meta 标签
Metadata 中文名叫元数据，是用于描述数据的数据。它不会显示在页面上，但是机器却可以识别。meta 常用于定义页面的说明，关键字，最后修改日期，和其它的元数据。这些元数据将服务于浏览器，搜索引擎和其它网络服务。

meta 标签共有两个属性，分别是 name 属性和 http-equiv 属性：

- name：主要用于描述网页，比如网页的关键词，网站描述等。与之对应的属性值为 
- content：content 中的内容是对 name 填入类型的具体描述，便于搜索引擎抓取。比如我们常见的 viewport：
```
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
```
http-equiv：相当于文件的头作用，用于向浏览器传递一些有用的信息，以帮助正确地显示网页内容，与之对应的属性为 content。
```
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
以上代码告诉 IE 浏览器，IE8/9 及以后的版本都会以最高版本 IE 来渲染页面。

#Meta Service
为了让开发者能够方便地操作页面中的 Meta 信息，Angular 为我们提供 Meta 服务。该服务支持以下的方法：

- addTag
- addTags
- getTag
- getTags
- updateTag
- removeTag
- removeTagElement

首先要使用 Meta 服务，我们需要从 @angular/platform-browser 库导入 Meta 类，然后利用 Angular 依赖注入的机制，通过构造注入的方式注入 Meta 服务：
```
import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
   providedIn: 'root'
})
export class MetaService { 
  constructor(private meta: Meta) { }
}
```
**addTag()**
该方法用于在页面上添加一个 HTML Meta 标签，它接收两个参数：

- tag：MetaDefinition 类型的对象
- forceCreation：是否强制创建，默认为 false
```
this.meta.addTag({ name: 'description', content: 'Angular Meta Service' });
    this.meta.addTag({ name: 'keywords', content: 'Angular, RxJS, TypeScript' });
```
**addTags()**
该方法用于一次性添加多个 HTML Meta 标签，它接收两个参数：

- tags：MetaDefinition 类型的对象数组
- forceCreation：是否强制创建，默认为 false
```
addTags() {
  this.meta.addTags([
    { name: 'description', content: 'Angular Meta Service' },
    { name: 'keywords', content: 'Angular, RxJS, TypeScript' }
  ]);
}
```

**getTag()**
该方法用于获取 attrSelector 属性选择器对应的 HTMLMetaElement 对象，它接收一个参数，即属性选择器，比如我们需要获取 keywords meta 标签：
```
getMetaTag(){
  let metaEl: HTMLMetaElement = this.meta.getTag('name="keywords"');
  console.log(`Get keywords meta tag: ${metaEl}`);
}
```

**getTags()**
该方法用于获取所有匹配 attrSelector 选择器的所有 HTMLMetaElement 对象:
```
getMetaTags() {
  let els: HTMLMetaElement[] = this.meta.getTags('name');
  els.forEach(el => {
    console.log(el);
    console.log(el.name);
    console.log(el.content);
  });
}
```
**updateTag()**
该方法用于更新 HTML Meta 标签的信息，它接收两个参数：

- tag：MetaDefinition 类型的对象
- selector（可选）：选择器
```
  this.meta.updateTag({ name: 'keywords', content: 'Node.js, Angular' });
```

**removeTag()**
该方法用于移除匹配 attrSelector 属性选择器的 HTML Meta 标签：
```
removeMetaTags() {
  this.meta.removeTag('name="description"');
  this.meta.removeTag('name="keywords"');
}
```


#Meta Service 源码简析
**Meta Service 类及构造函数**
```
@Injectable({providedIn: 'root', useFactory: createMeta, deps: []})
export class Meta {
  private _dom: DomAdapter;
  constructor(@Inject(DOCUMENT) private _doc: any) { 
      this._dom = getDOM(); // 获取DOM适配器
  }
}
```
通过观察 Injectable 装饰器的 Meta 元信息，我们知道 Meta 服务将被注册在根级注入器中，当首次获取 Meta 服务时，将使用 createMeta() 工厂方法创建对应的实例。

```
import {Inject, Injectable, inject} from '@angular/core';

export function createMeta() {
  return new Meta(inject(DOCUMENT));// 注意这里是小写的inject的哦
}
```
接下来我们从最简单的 addTag() 方法开始分析。
**addTag()**
```
addTag(tag: MetaDefinition, forceCreation: boolean = false): HTMLMetaElement|null {
  if (!tag) return null;
  return this._getOrCreateElement(tag, forceCreation);
}
```
这时我们知道其实在 addTag() 方法内部，最终是调用内部的私有方法 _getOrCreateElement() 来执行具体操作。_getOrCreateElement() 方法的具体实现如下：
```
private _getOrCreateElement(meta: MetaDefinition, forceCreation: boolean = false):
      HTMLMetaElement {
    if (!forceCreation) { // 非强制模式
      const selector: string = this._parseSelector(meta); // 解析选择器
      const elem: HTMLMetaElement = this.getTag(selector) !; // 获取选择器匹配的Meta元素
      // It's allowed to have multiple elements with the same name so it's not enough to
      // just check that element with the same name already present on the page. 
      // We also need to check if element has tag attributes
      if (elem && this._containsAttributes(meta, elem)) return elem;
    }
    // 调用Dom适配器的createElement()方法创建meta元素  
    const element: HTMLMetaElement = this._dom.createElement('meta') as HTMLMetaElement;
    this._setMetaElementAttributes(meta, element);
    // 获取head元素，添加新建的meta元素并返回该元素      
    const head = this._dom.getElementsByTagName(this._doc, 'head')[0];
    this._dom.appendChild(head, element);
    return element;
}

// 解析选择器
private _parseSelector(tag: MetaDefinition): string {
   const attr: string = tag.name ? 'name' : 'property';
   return `${attr}="${tag[attr]}"`;
}

// 设置Meta元素的属性
private _setMetaElementAttributes(tag: MetaDefinition, el: HTMLMetaElement): 
   HTMLMetaElement {
    Object.keys(tag).forEach((prop: string) => 
      this._dom.setAttribute(el, prop, tag[prop]));
    return el;
}
```
**getTag()**
```
getTag(attrSelector: string): HTMLMetaElement|null {
  if (!attrSelector) return null; 
  return this._dom.querySelector(this._doc, `meta[${attrSelector}]`) || null;
}
```
该方法内部的实现也很简单，就是通过 DOM 适配器的 querySelector API 来实现元素匹配。对于前面的示例来说
```
let metaEl: HTMLMetaElement = this.meta.getTag('name="keywords"');
```
内部会转换为：
```
return this._dom.querySelector(this._doc, "meta[name='keywords')" || null;
```

**updateTag()**
```
updateTag(tag: MetaDefinition, selector?: string): HTMLMetaElement|null {
    if (!tag) return null;
    selector = selector || this._parseSelector(tag); // 解析选择器
    const meta: HTMLMetaElement = this.getTag(selector) !; // 获取选择器对应的 Meta 元素
    if (meta) { // 若已存在，则更新对应的属性
      return this._setMetaElementAttributes(tag, meta);
    }
    return this._getOrCreateElement(tag, true); // 否则在force模式下，创建 Meta 元素
}
```
**removeTag()**
```
removeTag(attrSelector: string): void { 
    this.removeTagElement(this.getTag(attrSelector) !);
}

removeTagElement(meta: HTMLMetaElement): void {
    if (meta) {
      this._dom.remove(meta);
    }
}
```

