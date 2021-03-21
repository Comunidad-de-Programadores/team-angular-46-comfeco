import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(endpoint: string, options?): Observable<any> {
    return this.http.get(`${endpoint}`, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(endpoint: string, data, options?): Observable<any> {
    return this.http.post(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(endpoint: string, data, options?): Observable<any> {
    return this.http.put(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch(endpoint: string, data, options?): Observable<any> {
    return this.http.patch(`${endpoint}`, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete(endpoint: string, options?): Observable<any> {
    return this.http.delete(`${endpoint}`, options);
  }
}
