import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { InsigniaType } from './insignia.enum';

@Injectable({
  providedIn: 'root'
})
export class InsigniaService {

  private medalSource = new BehaviorSubject<InsigniaType>(InsigniaType.SOCIABLE);
  public medal$ = this.medalSource.asObservable();

  private insigniaSource = new BehaviorSubject<boolean>(false);
  public insignia$ = this.insigniaSource.asObservable();
  private hiddenSource = new BehaviorSubject<boolean>(false);
  public hidden$ = this.hiddenSource.asObservable();
  
  show(medal:InsigniaType) {
    this.medalSource.next(medal);
    this.insigniaSource.next(true);
    this.hiddenSource.next(false);

    setTimeout(_=> {
      this.hiddenSource.next(true);
      setTimeout(_=> {
        this.insigniaSource.next(false);
        this.hiddenSource.next(false);
      }, 2500);
    }, 2000);
  }

}
