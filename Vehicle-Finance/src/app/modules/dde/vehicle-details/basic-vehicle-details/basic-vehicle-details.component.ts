import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit {

  public formDataFromChild: any = {};
  public vehicleDetails: any = [];
  public routerId: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public vehicleDataStoreService: VehicleDataStoreService) { }

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

}

}
