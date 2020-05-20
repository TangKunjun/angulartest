import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';


import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import {NoIfDirective} from './no-if.directive';
import { ChildComponent } from './child/child.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpComponent } from './http/http.component';
import {InterceptorService} from './interceptor.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MetaService} from './meta.service';
import {TitleService} from './title.service';
import {AuthFormComponent} from './auth-form/auth-form.component';
import {AuthMessageComponent} from './auth-message/auth-message.component';
import {FormsModule} from '@angular/forms';
import {AuthRememberComponent} from './auth-remember/auth-remember-component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/", ".json");
}


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'http', component: HttpComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoIfDirective,
    ChildComponent,
    HttpComponent,
    AuthFormComponent,
    AuthMessageComponent,
    AuthRememberComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [ChildComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
  },
    MetaService,
    TitleService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log('APP_INITIALIZER执行后再执行其他');
              resolve();
            }, 4000);
          });
        };
      },
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
