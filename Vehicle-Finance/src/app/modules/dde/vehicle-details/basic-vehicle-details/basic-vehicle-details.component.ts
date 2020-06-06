import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit {

  public formDataFromChild: any = {};
  public vehicleDetails: any = [];
  public routerId: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public vehicleDataStoreService: VehicleDataStoreService,
    private vehicleDetailService: VehicleDetailService, private router: Router) { }

  ngOnInit() {
    // this.activatedRoute.params.subscribe((value) => {
    //   this.routerId = value ? value.vehicleId : null;
    // })
    this.routerId = this.vehicleDataStoreService.getCreditLeadId();

    console.log('RouterId', this.routerId)
  }

  FormDataParentMethod(value: any) {
    this.formDataFromChild = value;
    this.vehicleDetails = value;
  }

  onSubmit() {
    console.log(this.vehicleDetails, 'value')

    if (this.vehicleDetails.length > 0) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = data.manuFacMonthYear === 'Invalid Date' ? null : data.manuFacMonthYear

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        this.router.navigate(['pages/dde/' + this.routerId + '/vehicle-details']);
      }, error => {
        console.log(error, 'error')
      })
    } else {
      alert('Please Select any one of the Value')
    }
  }

}
