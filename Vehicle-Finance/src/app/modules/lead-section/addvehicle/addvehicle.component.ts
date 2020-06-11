import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';

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
  isHidden: boolean = false;

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
    private utilityService: UtilityService) { }

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
        // this.isHidden = true;
        this.selectedVehicle = Number(this.routerId);
      }
    })

  }

  // parent method to call the child method to access form data

  FormDataParentMethod(value: any) {
    console.log(value, 'valie')
    this.formDataFromChild = value;
    this.vehicleDetails = value;
  }

  onFormSubmit() {
    this.saveVehicleCollaterals();
  }


  saveVehicleCollaterals() {
    this.isHidden = false;
    console.log(this.vehicleDetails, 'Details')
    if (this.vehicleDetails.length > 0) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear)

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        this.isHidden = true;
        this.errorMsg = res.ProcessVariables.error.message;
        this.router.navigate(['pages/lead-section/' + this.leadId + '/vehicle-details']);
      }, error => {
        console.log(error, 'error')
      })
    } else {
      this.isHidden = true;
      this.errorMsg = 'Please select one of the any vehicle details'
      // alert('Please Select any one of the Veh')
    }
  }
}
