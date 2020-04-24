import {Directive, Input, HostBinding, TemplateRef, ViewContainerRef, HostListener, Attribute} from '@angular/core';

@Directive({
  selector: '[noIf]'
})
export class NoIfDirective {

  @Input('noIf')
  set content (value: boolean) {
    if (!value) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }  else {
      this.viewContainer.clear();
    }
  }
  constructor(
    @Attribute('id') private id: string,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  // 属性绑定
  @HostBinding() get innerHTML() {
    return '<p>我是测试</p>';
  }

  // 绑定方法
  @HostListener('click', ['$event'])
  onclick(event) {
    console.log('点击方法');
  }
}
