import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
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
    private activateRoute: ActivatedRoute,
    private leadService: CreateLeadDataService
  ) {}

  ngOnInit() {
    this.activateRoute.parent.params.subscribe((value) => {
      this.leadId = Number(value.leadId);
    });
    const leadSectionData: any = this.leadService.getLeadSectionData();
    const vehicleList = leadSectionData.vehicleCollateral;
    this.getVehicleList(vehicleList);
  }

  onVehicleChange(value) {
    this.selectedDetails = {
      id: value.key,
      associatedWith: 1,
    };
  }

  getVehicleList(vehicleList) {
    this.vehicleList = vehicleList.map((val) => {
      let collateralValue = '';
      if (!val.regNo) {
        if (val.make) {
          collateralValue += val.make;
        }
        if (val.model) {
          collateralValue += ' ' + val.model;
        }
      } else {
        collateralValue = val.regNo;
      }
      return {
        key: val.collateralId,
        value: collateralValue,
      };
    });
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
    // this.vehicleDetailsService
    //   .getAllVehicleCollateralDetails(id)
    //   .pipe(
    //     map((value: any) => {
    //       if (value.Error !== '0') {
    //         return null;
    //       }
    //       const processVariables = value.ProcessVariables;
    //       const vehicleList = processVariables.vehicleDetails || [];
    //       return vehicleList.map((val) => {
    //         let collateralValue = '';
    //         if (!val.regNo) {
    //           if (val.make) {
    //             collateralValue += val.make;
    //           }
    //           if (val.model) {
    //             collateralValue += ' '+ val.model;
    //           }
    //         } else {
    //           collateralValue = val.regNo;
    //         }
    //         return {
    //           key: val.collateralId,
    //           value: collateralValue,
    //         };
    //       });
    //     })
    //   )
    //   .subscribe((res: any) => {
    //     this.vehicleList = res;
    //     if (this.vehicleList.lenth === 0) {
    //       return;
    //     }
    //     this.selectedVehicle = Number(this.vehicleList[0].key);
    //     // this.vehicleList = res.ProcessVariables.vehicleDetails
    //     //   ? res.ProcessVariables.vehicleDetails
    //     //   : [];
    //     this.selectedDetails = {
    //       id: this.selectedVehicle,
    //       associatedWith: 1,
    //     };
    //     console.log('this.vehicleList', this.vehicleList);
    //   });
  }
}
