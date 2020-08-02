import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-collateraldocument',
  templateUrl: './collateraldocument.component.html',
  styleUrls: ['./collateraldocument.component.css'],
})
export class CollateraldocumentComponent implements OnInit {
  vehicleList;
  selectedVehicle;
  leadId: number;
  selectedDetails: {
    id: number;
    associatedWith: number;
  };
  constructor(
    private vehicleDetailsService: VehicleDetailService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activateRoute.parent.params.subscribe((value) => {
      this.leadId = Number(value.leadId);
      this.getVehicleList(this.leadId);
    });
  }

  onVehicleChange(event) {
    this.selectedDetails = {
      id: event.key,
      associatedWith: 1,
    };
  }

  getVehicleList(id) {
    this.vehicleDetailsService
      .getAllVehicleCollateralDetails(id)
      .pipe(
        map((value: any) => {
          if (value.Error !== '0') {
            return null;
          }
          const processVariables = value.ProcessVariables;
          const vehicleList = processVariables.vehicleDetails || [];
          return vehicleList.map((val) => {
            return {
              key: val.collateralId,
              value: val.regNo,
            };
          });
        })
      )
      .subscribe((res: any) => {
        this.vehicleList = res;
        if (this.vehicleList.lenth === 0) {
          return;
        }
        this.selectedVehicle = Number(this.vehicleList[0].key);
        // this.vehicleList = res.ProcessVariables.vehicleDetails
        //   ? res.ProcessVariables.vehicleDetails
        //   : [];
        this.selectedDetails = {
          id: this.selectedVehicle,
          associatedWith: 1,
        };
        console.log('this.vehicleList', this.vehicleList);
      });
  }
}
