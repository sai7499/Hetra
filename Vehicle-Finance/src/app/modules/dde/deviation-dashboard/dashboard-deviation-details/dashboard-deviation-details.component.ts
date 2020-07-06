import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-dashboard-deviation-details',
  templateUrl: './dashboard-deviation-details.component.html',
  styleUrls: ['./dashboard-deviation-details.component.css']
})
export class DashboardDeviationDetailsComponent implements OnInit {

  labels: any = {};
  isDirty: boolean = false;
  public formValue: any = {};
  public leadId: number;
  public userId: string;

  constructor(private labelsData: LabelsService, private sharedService: SharedService, private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService, private loginStoreService: LoginStoreService, private deviationService: DeviationService,
    private toasterService: ToasterService) { }

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

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })
  }

  FormDataParentMethod(event) {

  }

  saveorUpdateDeviationDetails() {

    if (this.formValue.valid) {
      let data = [];

      if (this.formValue.value.autoDeviationFormArray.length > 0) {

        
        data = data.concat(this.formValue.value.autoDeviationFormArray);
        data = data.concat(this.formValue.value.manualDeviationFormArray);

      } else {
        data = this.formValue.value.manualDeviationFormArray
      }

      this.deviationService.saveOrUpdateDeviations(this.leadId, data, this.userId).subscribe((res: any) => {
        console.log('res', res)

        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          let updateDevision = res.ProcessVariables.updatedDev ? res.ProcessVariables.updatedDev : []
          this.sharedService.getUpdatedDeviation(updateDevision)
          this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Deviation Save/Update')
        }
      }, err => {
        console.log('err', err)
      })

    } else {
      this.isDirty = true;
      console.log('error', this.formValue)
      this.utilityService.validateAllFormFields(this.formValue)
    }

  }


}
