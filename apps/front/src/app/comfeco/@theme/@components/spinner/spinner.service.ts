import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSource = new BehaviorSubject<boolean>(false);
  public spinner$ = this.spinnerSource.asObservable();
  
  show() {
    this.spinnerSource.next(true);
  }

  hidde() {
    this.spinnerSource.next(false);
  }
}
