import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { ApplicantDetails } from '@model/applicant.model';
import { HttpService } from '@services/http.service';
import { ApplicantService } from '@services/applicant.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicantResolveService implements Resolve<ApplicantDetails> {
  constructor(
    private httpService: HttpService,
    private applicantService: ApplicantService
  ) {}

  resolve(
    router: ActivatedRouteSnapshot,
    RouterState: RouterStateSnapshot
  ): Observable<ApplicantDetails> | ApplicantDetails {
    console.log('router', router.params);
    return;
  }
}
