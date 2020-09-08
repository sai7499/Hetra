import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { Router } from '@angular/router';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common';

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

  locationIndex: any;
  findInedx: any;
  selectCollateralId: any;

  collateralArray: any =[
    {
      colleteralType: 'Colleteral Type-1',
      column2: '',
      column3: '',
      collateralId: 1
    },
    {
      colleteralType: 'Colleteral Type-2',
      column2: '',
      column3: '',
      collateralId: 2
    }
  ]

  constructor(
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private vehicleDetailsService: VehicleDetailService,
    private router: Router,
    public vehicleDataStoreService: VehicleDataStoreService,
    public createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService,
    private location: Location) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);

    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;
    this.getVehicleDetails(this.leadId);

    this.labelsData.getLabelsData().subscribe(data => {
      this.label = data;
    }, error => {
      console.log('error', error);
    });

  }

  getLocationIndex(url) {
    if (url.includes('lead-section')) {
      return 'lead-section';
    } else if (url.includes('sales')) {
      return 'sales';
    }
  }
  editVehicle(collateralId: number) {
    this.router.navigate(['/pages/' + this.locationIndex + '/' + this.leadId + '/add-vehicle', { vehicleId: collateralId }]);
  }

  onEditVehicleDetails(collateralId: number) {
    this.router.navigate(['/pages/vehicle-details/' + this.leadId + '/basic-vehicle-details', { vehicleId: collateralId }]);
  }

  getVehicleDetails(id: number) {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
      this.vehicleArray = res.ProcessVariables.vehicleDetails ? res.ProcessVariables.vehicleDetails : [];
      this.vehicleDataStoreService.setVehicleDetails(res.ProcessVariables.vehicleDetails)
    }, error => {
      console.log(error, 'error');
    });
  }

  softDeleteCollateral(index: number, id) {
    this.findInedx = index;
    this.selectCollateralId = Number(id)
  }

  DeleteVehicleDetails() {
    this.vehicleDetailsService.getDeleteVehicleDetails(this.selectCollateralId, this.userId).subscribe((res: any) => {
      const apiError = res.ProcessVariables.error.message;

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess(apiError, 'Delete Vehicle Details');
        this.getVehicleDetails(this.leadId)
      } else {
        this.toasterService.showError(apiError, 'Delete Vehicle Details')
      }
    }, error => {
      console.log('error', error);
    }
    );
  }
}
