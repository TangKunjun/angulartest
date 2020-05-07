import {Component, Inject, InjectionToken, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(translate: TranslateService, private title: Title, private router: Router) {
    translate.setDefaultLang("zh-cn");
    translate.use("en");

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case "/":
            this.title.setTitle("首页");
            break;
          case "/http":
            this.title.setTitle("http");
            break;
        }
      }
    });

  }
}

const SOME_TOKEN: InjectionToken<Array<string>> = new InjectionToken("很多token");

const injector = Injector.create([
  {provide: SOME_TOKEN, useValue: '我是第一个', multi: true},
  {provide: SOME_TOKEN, useValue: '我是第2个', multi: true},
])

const dep = injector.get(SOME_TOKEN);
console.log(dep);
