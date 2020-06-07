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
  public leadId: number;

  constructor(private activatedRoute: ActivatedRoute, public vehicleDataStoreService: VehicleDataStoreService,
    private vehicleDetailService: VehicleDetailService, private router: Router) { }

  async ngOnInit() {

    this.routerId = this.vehicleDataStoreService.getCreditLeadId();

    let leadId = (await this.getLeadId()) as number;

    this.leadId = this.routerId ? this.vehicleDataStoreService.getCreditLeadId() :leadId;

  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        const leadId = value.leadId;
        if (leadId) {
          resolve(Number(leadId));
        }
        resolve(null);
      });
    });
  }

  FormDataParentMethod(value: any) {
    this.formDataFromChild = value;
    this.vehicleDetails = value[0].creditFormArray;
  }

  onSubmit() {
    console.log(this.vehicleDetails, 'value')

    if (this.vehicleDetails.length > 0) {
      const data = this.vehicleDetails[0];

      data.manuFacMonthYear = data.manuFacMonthYear === 'Invalid Date' ? null : data.manuFacMonthYear

      this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        // this.router.navigate(['pages/dde/' + this.routerId + '/vehicle-details']);
      }, error => {
        console.log(error, 'error')
      })
    } else {
      alert('Please Select any one of the Value')
    }
  }

}
