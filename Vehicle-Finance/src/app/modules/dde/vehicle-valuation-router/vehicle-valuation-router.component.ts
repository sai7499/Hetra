import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleValuationService } from '../services/vehicle-valuation.service';

@Component({
    templateUrl: './vehicle-valuation-router.component.html',
    styleUrls: ['./vehicle-valuation-router.component.css']
})
export class VehicleValuationRouterComponent implements OnInit {

    leadId;
    colleteralId;
    collateralDetailsData: any = [];
    constructor(
        private router: Router,
        private aRoute: ActivatedRoute,
        private vehicleValuationService: VehicleValuationService
    ) { }

   async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    // console.log("LEADID--->", this.leadId);
    this.colleteralId = (await this.getCollateralId()) as Number;
    // console.log("COLLATERALID*****", this.colleteralId);
    }

    getLeadId() {
        return new Promise((resolve, reject) => {
          this.aRoute.params.subscribe((value) => {
            const leadId = value.leadId;
            if (leadId) {
              resolve(Number(leadId));
            }
            resolve(null);
          });
        });
    }

    getCollateralId() {
      return new Promise((resolve, reject) => {
        this.aRoute.firstChild.params.subscribe((value) => {
          const colleteralId = value.colleteralId;
          if (colleteralId) {
            resolve(Number(colleteralId));
          }
          resolve(null);
        });
      });
    }

}
