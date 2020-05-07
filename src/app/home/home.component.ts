import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  OnInit,
  TemplateRef,
  ViewChild,
  ComponentRef,
  ViewContainerRef
} from '@angular/core';
import {ChildComponent} from '../child/child.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  child = ChildComponent;
  context = {
    message: 'Hello ngOutletContext!',
    $implicit: '我是默认的!'
  };
  @ViewChild('tmp') tmpRef: TemplateRef<any>;

  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  componentRef: ComponentRef<any>;
  constructor(
    private vcRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    console.log("APP_INITIALIZER先执行")
    const factory = this.cfr.resolveComponentFactory(ChildComponent); // 创建组件工厂
    this.componentRef = this.vc.createComponent(factory); // 创建组件引用
    this.componentRef.instance.data = {a: 1, b: 2, c: 3};
    setTimeout(() => {
      this.componentRef.instance.data =  {a: "a"}
    }, 3000)
  }

  // 当数据发送变化时 内嵌的组件更新
  ngAfterViewChecked(): void {
    if (this.componentRef) {
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }
  ngAfterViewInit(): void {
    this.vcRef.createEmbeddedView(this.tmpRef);
  }

  identify(index, item) {
    return item;
  }


}
