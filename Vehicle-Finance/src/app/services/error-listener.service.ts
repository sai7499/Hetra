import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorListenerService {

  constructor() { }

  errorObs$ = new Subject();

  setError(value) {
      this.errorObs$.next(value);
  }

  getErrorListener() {
      return this.errorObs$;
  }
}
