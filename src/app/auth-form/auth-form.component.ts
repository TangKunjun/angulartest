import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  ViewChild,
  QueryList,
  AfterContentInit,
  AfterViewInit,
  ViewChildren, ChangeDetectorRef
} from '@angular/core';
import {AuthMessageComponent} from '../auth-message/auth-message.component';
import {AuthRememberComponent} from '../auth-remember/auth-remember-component';


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
        <auth-message [style.display]="(showMessage ? 'inherit' : 'none')"></auth-message>
        <auth-message [style.display]="(showMessage ? 'inherit' : 'none')"></auth-message>
        <ng-content select="button">
        </ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent implements AfterContentInit, AfterViewInit {

  showMessage: boolean;

  @ViewChildren(AuthMessageComponent) message: QueryList<AuthMessageComponent>;

  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;

  @Output() submitted: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.message) {
      this.message.forEach((message) => {
        console.log(message)
        message.days = 30;
      });
      this.cd.detectChanges();
    }
  }

  ngAfterContentInit() {
    if (this.message) {
      // this.message.days = 30;
      this.message.forEach(v => v.days = 30);
    }
    if (this.remember) {
      this.remember.forEach((item) => {
        item.checked.subscribe((checked: boolean) => this.showMessage = checked);
      });
    }
  }

  // ...
}
