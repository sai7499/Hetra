import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DraggableContainerService {
  draggable$ = new BehaviorSubject<string>(null);
  removeImage$ = new BehaviorSubject<string>(null);

  setContainerValue(value) {
    this.draggable$.next(value);
  }

  getContainerValue() {
    return this.draggable$;
  }

  imageRemoveListener() {
    return this.removeImage$;
  }

  removeImage(name: string) {
    this.removeImage$.next(name);
  }
}
