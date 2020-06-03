import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SaveUpdateApplicantService {
  constructor(private httpService: HttpService) { }

  saveApplicant(data) {

  }
}
