import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from "src/app/services/labels.service";
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-deviations',
  templateUrl: './deviations.component.html',
  styleUrls: ['./deviations.component.css']
})
export class DeviationsComponent implements OnInit, OnDestroy {
  labels: any = {};
  isDirty: boolean = false;
  public formValue: any = {};
  public leadId: number;
  public userId: string;
  public subscription: any;

  isSendBacktoCredit: boolean;
  isSubmitToCredit: boolean;
  locationIndex: string = '';

  isLoan360: boolean;
  disableSaveBtn: boolean;

  constructor(private labelsData: LabelsService, private sharedService: SharedService, private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService, private loginStoreService: LoginStoreService, private deviationService: DeviationService,
    private toasterService: ToasterService, private location: Location,
    private loanViewService: LoanViewService,
    private router: Router) { }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = leadData['leadId'];

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    let roles = roleAndUserDetails.roles;
    let roleId = roles[0].roleId;
    let roleType = roles[0].roleType;

    this.disableSaveBtn = (roleType === 5) ? true : false;
    this.userId = roleAndUserDetails.userDetails.userId;

    this.subscription = this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

    let currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);

    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

  }

  getLocationIndex(url) {
    if (url.includes('dde')) {
      this.isSubmitToCredit = true;
      this.isSendBacktoCredit = false;
      return 'dde';
    } else if (url.includes('credit-decisions')) {
      this.isSubmitToCredit = false;
      this.isSendBacktoCredit = true;
      return 'credit-decisions';
    } else if (url.includes('deviation-dashboard')) {
      this.isSendBacktoCredit = false;
      return 'deviation-dashboard';
    }
  }

  onNext() {
    this.router.navigateByUrl(`pages/dde/${this.leadId}/disbursement/${this.leadId}`);
  }

  saveorUpdateDeviationDetails() {

    if (this.formValue.valid) {
      console.log(this.formValue, 'value')
      let data = [];

      if (this.formValue.controls.isDuplicateDeviation.value) {

      if (this.formValue.value.autoDeviationFormArray.length > 0) {
        data = data.concat(this.formValue.value.autoDeviationFormArray);
        data = data.concat(this.formValue.value.manualDeviationFormArray);
      } else {
        data = this.formValue.value.manualDeviationFormArray
      }

      if (this.formValue.value.waiverNormsFormArray.length > 0) {
        data = data.concat(this.formValue.value.waiverNormsFormArray);
      }

      this.deviationService.saveOrUpdateDeviations(this.leadId, data, this.userId).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          let updateDevision = res.ProcessVariables.updatedDev ? res.ProcessVariables.updatedDev : []
          this.sharedService.getUpdatedDeviation(updateDevision)
          this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Deviation Save/Update')
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Deviation Save/Update')
        }
      }, err => {
        console.log('err', err)
      })
    } else {
       this.toasterService.showError('Please change the deviation or approval role', 'Duplicate Deviation')
    }

    } else {
      this.isDirty = true;
      this.toasterService.showError('Please enter all mandatory field', 'Deviation Save/Update')
      this.utilityService.validateAllFormFields(this.formValue)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}