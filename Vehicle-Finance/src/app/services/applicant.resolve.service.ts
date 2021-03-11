import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Applicant } from '@model/applicant.model';
import { HttpService } from '@services/http.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { formatDate, Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApplicantResolveService implements Resolve<boolean> {
  previousApplicantId: number;
  constructor(
    private httpService: HttpService,
    private applicantService: ApplicantService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private location: Location,
  ) {}

  resolve(
    router: ActivatedRouteSnapshot,
    RouterState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const url= this.location.path();
    const leadId = Number(router.params.leadId);
    const applicantId = Number(router.firstChild.params.applicantId);
    if (isNaN(leadId) || isNaN(applicantId)) {
      return;
    }
    let groupId= 'APG008';
    
    this.previousApplicantId = applicantId;
    const data = {
      applicantId,
      "udfDetails": [
        {
          "udfGroupId": groupId,
        }
      ]
    };
    return this.applicantService.getApplicantDetail(data).pipe(
      map((value: any) => {
        if (value.Error === '0') {
          const processVariables = value.ProcessVariables;
          const applicant: Applicant = {
            ...processVariables,
          };
          this.applicantDataStoreService.setApplicant(applicant);
          this.applicantDataStoreService.setNatureOfBorrower(applicant.natureOfBorrower)
          return true;
        }
        return false;
      })
    );
  }
}
