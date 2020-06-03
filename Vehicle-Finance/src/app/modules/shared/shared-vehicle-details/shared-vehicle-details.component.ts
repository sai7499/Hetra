import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { Router } from '@angular/router';
import { LeadDataResolverService } from '../../lead-section/services/leadDataResolver.service';

@Component({
  selector: 'app-shared-vehicle-details',
  templateUrl: './shared-vehicle-details.component.html',
  styleUrls: ['./shared-vehicle-details.component.css']
})
export class SharedVehicleDetailsComponent implements OnInit {

  roleId: any;
  roleName: string;
  roleType: any;
  roles = [];
  public label: any = {};
  vehicleArray = [];
  public leadId: number;

  public vehicleListArray = [
    {
      registrationNum: 'TN-04-SS-0292',
      make: 'TATA',
      model: 'SUMO'
    },
    {
      registrationNum: 'KL-05-AG-1191',
      make: 'TATA',
      model: 'SUMO'
    }
  ];

  constructor(
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private vehicleDetailsService: VehicleDetailService,
    private router: Router,
    public leadData: LeadDataResolverService) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.leadId = parseInt(this.leadData.leadId);
    this.getVehicleDetails(this.leadId)

    this.labelsData.getLabelsData().subscribe(data => {
      this.label = data;
    }, error => {
      console.log('error', error)
    });

  }

  editVehicle(collateralId: number) {
    this.router.navigate(['pages/lead-section/' + this.leadId + '/add-vehicle', { vehicleId: collateralId }]);
  }

  getVehicleDetails(id: number) {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
      if (res.ProcessVariables) {
        this.vehicleArray = res.ProcessVariables.vehicleDetails ? res.ProcessVariables.vehicleDetails : [];
      }
    })
  }

  removeOtherIndex(i, vehicleArray: any) {
    if (vehicleArray.length > 1) {
      vehicleArray.splice(i, 1)
    } else {
      alert("Atleast One Row Required");
    }
  }
}