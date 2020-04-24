import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import {NoIfDirective} from './no-if.directive';
import { ChildComponent } from './child/child.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HttpComponent } from './http/http.component';
import {InterceptorService} from './interceptor.service';

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
    RouterModule.forRoot(routes)
  ],
  entryComponents: [ChildComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
