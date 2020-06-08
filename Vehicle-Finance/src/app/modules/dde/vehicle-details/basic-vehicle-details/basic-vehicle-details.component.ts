import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';

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

  constructor(private createLeadDataService: CreateLeadDataService, public vehicleDataStoreService: VehicleDataStoreService,
    private vehicleDetailService: VehicleDetailService, private utilityService: UtilityService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;


    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

  }


  FormDataParentMethod(value: any) {
    this.formDataFromChild = value;
    this.vehicleDetails = value[0].creditFormArray;
  }

  onSubmit() {
    console.log(this.vehicleDetails, 'value')

    if (this.vehicleDetails.length > 0) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = data.manuFacMonthYear === 'Invalid Date' ? null : 
                              this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear)
      data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate) : null;
      data.permitExpireDate = data.permitExpireDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpireDate) : null;
      data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate) : null;
      data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity) : null;

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
      }, error => {
        console.log(error, 'error')
      })
    } else {
      alert('Please Select any one of the Value')
    }
  }

}
