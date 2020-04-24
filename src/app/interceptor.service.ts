import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from '../../node_modules/rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clone = req.clone({
      headers: req.headers.set('X-CustomAuthHeader', 'iloveangular')
    });
    return next.handle(clone);
  }

  constructor() { }

}
