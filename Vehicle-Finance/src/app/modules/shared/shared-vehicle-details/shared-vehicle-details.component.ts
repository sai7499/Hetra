import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

import { VehicleDetailService } from '../../lead-section/services/vehicle-detail.service';

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
  private leadId: "121";

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
    private vehicleDetailsService: VehicleDetailService) { }

  ngOnInit() {
    this.getVehicleDetails();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    
    this.labelsData.getLabelsData().subscribe(data => {
      this.label = data;
    },
      error => {
        console.log('error', error)
      });

  }

  getVehicleDetails() {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(this.leadId).subscribe((res: any) => {
      console.log('res', res)
      this.vehicleArray = res.ProcessVariables.vehicleDetails ? res.ProcessVariables.vehicleDetails : [];
    })
  }


  // sample code for understanding
  // this.createLeadService.getProductCategory(this.bizDivId).subscribe((res: any) => {
  //   const product = res.ProcessVariables.productCategoryDetails;
  //   product.map(data => {
  //     if (data) {
  //       const val = {
  //         key: data.assetProdcutCode,
  //         value: data.prodcutCatName
  //       };
  //       this.productCategoryData.push(val);
  //     }
  //   });
  // });

  removeOtherIndex(i, vehicleArray: any) {
    if (vehicleArray.length > 1) {
      console.log(i, 'i', vehicleArray.indexOf(i))
      // control.removeAt(i);
      vehicleArray.splice(i, 1)
    } else {
      alert("Atleast One Row Required");
    }
  }


}