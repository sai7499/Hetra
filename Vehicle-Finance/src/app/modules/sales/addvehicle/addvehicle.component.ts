import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  vehicleForm: FormGroup;
  private vehicleDetails: any = [];
  public label: any = {};
  public errorMsg: string;
  public getAllFieldLabel;
  public show: boolean = false;
  public formVehicle: any;
  public isAlert: boolean = false;
  selectedVehicle: number;
  formValue: any;

  isDirty: boolean;

  vehicleArray = [];
  routerId = 0;

  // process variable for save/update vehicle collaterals

  userId: number;
  vehicleId: number = 101;
  leadId: number;

  LOV: any = [];

  formDataFromChild: any = {};

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

    // method for getting all vehicle details related to a lead
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId']

    // method for getting labels 

    this.getAllFieldLabel = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
      if (this.routerId !== null && this.routerId !== undefined) {
        this.selectedVehicle = Number(this.routerId);
      }
    })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

  }

  // parent method to call the child method to access form data

  FormDataParentMethod(value: any) {
    this.formDataFromChild = value;
    this.vehicleDetails = value;
  }

  onFormSubmit() {
    this.saveVehicleCollaterals();
  }

  saveVehicleCollaterals() {
    if (this.formValue.valid === true) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY')

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        if (res.Error === '0' && res.Error === '0') {
          this.toasterService.showSuccess(apiError, '');
          this.router.navigate(['pages/sales/' + this.leadId + '/vehicle-list']);
        } else {
          this.toasterService.showError(apiError, '')
        }
      }, error => {
        console.log(error, 'error')
        this.toasterService.showError(error, '')
      })
    } else {
      this.isDirty = true;
      this.utilityService.validateAllFormFields(this.formValue)
    }
  }

}
