import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

export abstract class ApiData<T> {
  abstract get(id: number): Observable<HttpEvent<T>>;
  abstract update(item: T, id: number): Observable<HttpEvent<T>>;
  abstract add(item: T): Observable<HttpEvent<T>>;
  abstract delete(id: number): Observable<HttpEvent<boolean>>;
}
