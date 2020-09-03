import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LabelsService } from '@services/labels.service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit, OnDestroy {

  public leadData: any;
  public leadId: number;
  public label: any;
  public routerId: number;
  disableSaveBtn: boolean;

  public formValue: any;
  public isDirty: boolean;
  public subscription: any;

  constructor(private createLeadDataService: CreateLeadDataService, public vehicleDataStoreService: VehicleDataStoreService, private toasterService: ToasterService,
    private vehicleDetailService: VehicleDetailService, private utilityService: UtilityService, private router: Router,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService, private labelsData: LabelsService,
    private toggleDdeService: ToggleDdeService) { }

  ngOnInit() {

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          console.log('error', error)
          // this.errorMsg = error;
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

    this.subscription = this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType === '1') {
      this.disableSaveBtn = true;
    }
  }

  onSubmit() {

    if (this.formValue.valid === true) {

      if (this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber) {
        let data = this.formValue.value.vehicleFormArray[0];

        data.manuFacMonthYear = data.manuFacMonthYear ? this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY') : null;
        data.invoiceDate = data.invoiceDate ? this.utilityService.convertDateTimeTOUTC(data.invoiceDate, 'DD/MM/YYYY') : null;

        data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate, 'DD/MM/YYYY') : null;
        data.permitExpiryDate = data.permitExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpiryDate, 'DD/MM/YYYY') : null;
        data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate, 'DD/MM/YYYY') : null;
        data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : null;

        data.fsrdFundingReq = data.fsrdFundingReq === true ? '1' : '0';

        this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
          const apiError = res.ProcessVariables.error.message;

          if (res.Error === '0' && res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle Detail');
            this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
          } else {
            this.toasterService.showError(apiError, 'Vehicle Detail')
          }

        }, error => {
          console.log(error, 'error')
          this.toasterService.showError(error, 'Vehicle Detail')
        })

      } else {
        if (!this.formValue.value.isInvalidMobileNumber) {
          this.toasterService.showError('applicant and dealer of vehicle owner mobile number both are same', 'Invalid mobile no')
        } else if (!this.formValue.value.isValidPincode) {
          this.toasterService.showError('Please enter valid pincode', 'Invalid pincode')
        } else if (!(this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber)) {
          this.toasterService.showError('Please enter valid pincode and mobile no', 'Invalid pincode & mobile no')
        }
      }

    } else {
      this.isDirty = true;
      console.log('error', this.formValue)
      this.utilityService.validateAllFormFields(this.formValue)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

