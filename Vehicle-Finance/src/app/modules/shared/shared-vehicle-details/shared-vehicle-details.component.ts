import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

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
  public leadData: any = {};
  public userId: number;

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
    public vehicleDataStoreService: VehicleDataStoreService,
    public createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;
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

  onEditVehicleDetails(collateralId: number) {
    this.router.navigate(['/pages/vehicle-details/' + this.leadId + '/basic-vehicle-details', { vehicleId: collateralId }]);
  }

  getVehicleDetails(id: number) {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
      console.log(res)
      this.vehicleArray = res.ProcessVariables.vehicleDetails ? res.ProcessVariables.vehicleDetails : [];
    }, error => {
      console.log(error, 'error')
    })
  }

  DeleteVehicleDetails(vehicle: any) {
    if (vehicle) {
      this.vehicleDetailsService.getDeleteVehicleDetails(Number(vehicle.collateralId), this.userId).subscribe((res: any) => {
        this.getVehicleDetails(this.leadId)
      }, error => {
        console.log('error', error)
      }
      )
    }
  }
}