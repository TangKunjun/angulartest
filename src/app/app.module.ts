import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
    HttpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    TitleService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
