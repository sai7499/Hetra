import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit {

  public formDataFromChild: any = {};
  public vehicleDetails: any = [];
  public leadData: any;
  public leadId: number;
  public routerId: number;

  public isHidden: boolean = false;
  public errorMsg: string;
  public formValue: any;

  constructor(private createLeadDataService: CreateLeadDataService, public vehicleDataStoreService: VehicleDataStoreService, private toasterService: ToasterService,
    private vehicleDetailService: VehicleDetailService, private utilityService: UtilityService, private router: Router,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;


    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })
  }


  FormDataParentMethod(value: any) {
    console.log(this.formDataFromChild, 'value')

    this.formDataFromChild = value;
    this.vehicleDetails = value[0];

  }

  onSubmit() {

    console.log(this.vehicleDetails, 'vehicleDetails')


    this.isHidden = false;
    if (this.formValue.valid === true) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY')
      data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate, 'DD/MM/YYYY') : null;
      data.permitExpireDate = data.permitExpireDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpireDate, 'DD/MM/YYYY') : null;
      data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate, 'DD/MM/YYYY') : null;
      data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : null;

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        // this.isHidden = true;
        // this.errorMsg = res.ProcessVariables.error.message;
        const apiError = res.ProcessVariables.error.message;

        if (res.Error === '0' && res.Error === '0') {
          this.toasterService.showSuccess(apiError, '');
        } else {
          this.toasterService.showError(apiError, '')
        }

        this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
      }, error => {
        console.log(error, 'error')
      })
    } else {
      this.isHidden = true;
      this.errorMsg = 'Please select one of the any vehicle details';
      this.utilityService.validateAllFormFields(this.formValue)
      // alert('Please Select any one of the Veh')
    }
  }
}

