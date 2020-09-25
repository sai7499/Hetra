import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { Router } from '@angular/router';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common';
import { CollateralService } from '@services/collateral.service';
import { CollateralDataStoreService } from '@services/collateral-data-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ToggleDdeService } from '@services/toggle-dde.service';

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

  disableSaveBtn: boolean;

  locationIndex: any;
  findInedx: any;
  selectCollateralId: any;

  collateralArray: any = [];
  collateralLOV: any = [];
  isCollateralSrting: string = 'Collateral';

  constructor(
    private loginStoreService: LoginStoreService, private toggleDdeService: ToggleDdeService,
    private labelsData: LabelsService, private collateralService: CollateralService,
    private vehicleDetailsService: VehicleDetailService, private commonLovService: CommomLovService,
    private router: Router, private collateralDataStoreService: CollateralDataStoreService,
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

    let currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);

    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;
    this.getLov();

    this.labelsData.getLabelsData().subscribe(data => {
      this.label = data;
    }, error => {
      console.log('error', error);
    });

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType === '1' || operationType === '2') {
        this.disableSaveBtn = true;
    }

  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      let LOV = value.LOVS;
      this.collateralLOV = LOV['additionalCollateralDetails'];
      this.getVehicleDetails(this.leadId);
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

  editCollateralDetails(collateralId: number) {
    this.router.navigate(['/pages/vehicle-details/' + this.leadId + '/additional-collateral-details', { collateralId: collateralId }]);
  }

  onEditVehicleDetails(collateralId: number, loanAmount: any) {
    this.router.navigate(['/pages/vehicle-details/' + this.leadId + '/basic-vehicle-details', { vehicleId: collateralId, eligibleLoanAmount: loanAmount }]);
  }

  getVehicleDetails(id: number) {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        let collateralArrayCon = [];
        let additionalCollateralsArray = []

        this.vehicleArray = res.ProcessVariables.vehicleDetails ? res.ProcessVariables.vehicleDetails : [];
        collateralArrayCon = res.ProcessVariables.additionalCollaterals ? res.ProcessVariables.additionalCollaterals : [];

        if (collateralArrayCon && collateralArrayCon.length > 0) {

          collateralArrayCon.filter((res: any) => {

            this.collateralLOV.filter((data: any) => {
              if (data.key === res.collateralType) {
                additionalCollateralsArray.push({
                  collateralType: data.value,
                  applicantId: res.applicantId,
                  applicantType: res.applicantType,
                  collateralId: res.collateralId,
                  ownerName: res.ownerName,
                  relationship: res.relationship,
                  value: res.value
                })
              }
              return additionalCollateralsArray
            })
            return additionalCollateralsArray
          })
        }

        this.collateralArray = additionalCollateralsArray;

        this.vehicleDataStoreService.setVehicleDetails(res.ProcessVariables.vehicleDetails);
        this.collateralDataStoreService.setCollateralDetails(res.ProcessVariables.additionalCollaterals)
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.messageen, 'Delete Vehicle Details')
      }
    }, error => {
      console.log(error, 'error');
    });
  }

  softDeleteCollateral(index: number, id, isString: string) {
    this.findInedx = index;
    this.selectCollateralId = Number(id);
    this.isCollateralSrting = isString;
    console.log('index', 'id')
  }

  DeleteVehicleDetails() {

    if (this.isCollateralSrting === 'Collateral') {
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
      });
    } else if (this.isCollateralSrting === 'Additional Collateral') {

      this.collateralService.getDeleteAdditionalCollaterals(this.selectCollateralId, this.userId).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess(apiError, 'Delete Vehicle Details');
          this.getVehicleDetails(this.leadId)
        } else {
          this.toasterService.showError(apiError, 'Delete Vehicle Details')
        }
      }, error => {
        console.log('error', error);
      });

    }
  }
}
