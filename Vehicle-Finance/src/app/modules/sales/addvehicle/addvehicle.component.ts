import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent implements OnInit {

  public label: any = {};
  public errorMsg: string;
  formValue: any;

  isDirty: boolean;
  routerId = 0;

  // process variable for save/update vehicle collaterals
  userId: number;
  leadId: number;

  constructor(
    private labelsData: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private vehicleDetailService: VehicleDetailService,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private toasterService: ToasterService) { }

  ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId']

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

  }

  onFormSubmit() {

    if (this.formValue.valid === true) {
      let data = this.formValue.value.vehicleFormArray[0];

      data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY')

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        if (res.Error === '0' && res.Error === '0') {
          this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle List');
          this.router.navigate(['pages/sales/' + this.leadId + '/vehicle-list']);
        } else {
          this.toasterService.showError(apiError, 'Vehicle Details')
        }
      }, error => {
        console.log(error, 'error')
        this.toasterService.showError(error, 'Vehicle Details')
      })
    } else {
      this.isDirty = true;
      this.utilityService.validateAllFormFields(this.formValue)
    }
  }

}
