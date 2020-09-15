import { Component, OnInit, OnDestroy } from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { Location } from '@angular/common';

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
  disableSaveBtn: boolean;

  isSendBacktoCredit: boolean;
  isSubmitToCredit: boolean;
  locationIndex: string = '';

  constructor(private labelsData: LabelsService, private sharedService: SharedService, private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService, private loginStoreService: LoginStoreService, private deviationService: DeviationService,
    private toasterService: ToasterService, private toggleDdeService: ToggleDdeService, private location: Location) { }

  ngOnInit() {
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
      // this.isSubmitToCredit = false;
      this.isSendBacktoCredit = false;
      return 'deviation-dashboard';
    }
  }

  saveorUpdateDeviationDetails() {

    if (this.formValue.value.autoDeviationFormArray.length > 0 || this.formValue.valid) {
      let data = [];

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
        }
      }, err => {
        console.log('err', err)
      })

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