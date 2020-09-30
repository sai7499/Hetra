import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Categories } from '@model/upload-model';

Injectable({
  providedIn: 'root',
});
@Injectable()
export class CommomLovService {
  lovData: any;
  documentCategories: Categories[];

  setLovData(LOVsData) {
    this.lovData = LOVsData;
  }

  getLovData(): Observable<any> {
    return of(this.lovData);
  }

  setDocumentCategories(value) {
    this.documentCategories = value.categories || [];
  }

  getDocumentCategories() {
    return this.documentCategories;
  }
}
