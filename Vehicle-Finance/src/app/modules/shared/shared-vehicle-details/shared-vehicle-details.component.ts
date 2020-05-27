import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';


@Component({
  selector: 'app-shared-vehicle-details',
  templateUrl: './shared-vehicle-details.component.html',
  styleUrls: ['./shared-vehicle-details.component.css']
})
export class SharedVehicleDetailsComponent implements OnInit {

  roleId: any;
  roleName: string;
  roles = [];
  public label: any = {};

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
  constructor(private loginStoreService: LoginStoreService, private labelsData: LabelsService) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    console.log(this.roles, 'roleUser')
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;

    this.labelsData.getLabelsData().subscribe(data => {
      this.label = data;
    },
      error => {
        console.log('error', error)
        // this.errorMsg = error;
      });
  }


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