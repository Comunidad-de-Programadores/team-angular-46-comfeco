import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpRequest = new HttpRequest(<any>req.method, environment.urlApi+req.url, req.body);
    const reqClone = Object.assign(req, httpRequest).clone({ withCredentials: true });

    return next.handle(reqClone);
  }

}
