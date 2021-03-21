import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpGenericService<T> {
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(endpoint: string, options?): Observable<HttpEvent<T[]>> {
    return this.http.get<T[]>(`${endpoint}`, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(endpoint: string, data, options?): Observable<HttpEvent<T>> {
    return this.http.post<T>(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(endpoint: string, data, options?): Observable<HttpEvent<T>> {
    return this.http.put<T>(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch(endpoint: string, data, options?): Observable<HttpEvent<T>> {
    return this.http.patch<T>(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete(endpoint: string, options?): Observable<any> {
    return this.http.delete(`${endpoint}`, options);
  }
}
