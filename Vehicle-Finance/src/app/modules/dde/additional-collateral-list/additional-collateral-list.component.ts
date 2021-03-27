import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CollateralDataStoreService } from '@services/collateral-data-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { CollateralService } from '@services/collateral.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
    templateUrl: './additional-collateral-list.component.html',
    styleUrls: ['./additional-collateral-list.component.css']
})
export class AdditionalCollateralListComponent {
    public label: any = {};
    leadId: number;
    applicantList: any = [];

    findInedx: any;
    selectCollateralId: any;

    disableSaveBtn: boolean;

    collateralArray: any = [];
    collateralLOV: any = [];
    isCollateralSrting: string = 'Collateral';

    udfScreenId: string = '';
    userId: any;
    isDeleteModal : boolean;
  modalDetails: any;
  modalButtons: any;

    constructor(private labelsData: LabelsService,
        private createLeadDataService: CreateLeadDataService,
        private vehicleDetailsService: VehicleDetailService,
        private toasterService: ToasterService,
        private route: Router,
        private collateralService: CollateralService,
        private commonLovService: CommomLovService,
        private toggleDdeService: ToggleDdeService,
        private loanViewService: LoanViewService,
        private collateralDataStoreService: CollateralDataStoreService,
        private applicantDataStoreService: ApplicantDataStoreService,
        private labelService: LabelsService) { }

    ngOnInit() {
        this.labelsData.getLabelsData().subscribe(data => {
            this.label = data;
        }, error => {
            console.log('error', error);
        });

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];
        this.applicantList = this.applicantDataStoreService.getApplicantList();
        this.getLov();

        this.userId = localStorage.getItem('userId')

        this.labelService.getModalDetails().subscribe((data)=>{
          const details = data.addCollateral.deleteCollDetails;
          this.modalDetails = details.modalDetails,
          this.modalButtons = details.modalButtons
    
        })

        const operationType = this.toggleDdeService.getOperationType();
        if (operationType) {
            this.disableSaveBtn = true;
        }

        if (this.loanViewService.checkIsLoan360()) {
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

    getVehicleDetails(id: number) {
        this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
            if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
                let collateralArrayCon = [];
                let additionalCollateralsArray = []

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

                this.collateralDataStoreService.setCollateralDetails(res.ProcessVariables.additionalCollaterals)
            } else {
                this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Delete Vehicle Details')
            }
        }, error => {
            console.log(error, 'error');
        });
    }

    editCollateralDetails(collateralId: number) {
        this.route.navigate(['/pages/vehicle-details/' + this.leadId + '/additional-collateral-details', { collateralId: collateralId }]);
    }

    onNext() {
        this.route.navigate([`pages/dde/${this.leadId}/reference`]);
    }

    softDeleteCollateral(index: number, id, isString: string) {
        this.findInedx = index;
        this.selectCollateralId = Number(id);
        this.isCollateralSrting = isString;
      }
    
      DeleteVehicleDetails() {
    
        if (this.isCollateralSrting === 'Collateral') {
          this.vehicleDetailsService.getDeleteVehicleDetails(this.selectCollateralId, this.userId).subscribe((res: any) => {
            let apiError = res.ProcessVariables.error.message;
    
            if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
              this.toasterService.showSuccess(apiError, 'Delete Additional Collateral Details');
              this.getVehicleDetails(this.leadId)
            } else {
              this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : apiError, 'Delete Additional Collateral Details')
            }
          }, error => {
            console.log('error', error);
          });
        } else if (this.isCollateralSrting === 'Additional Collateral') {
    
          this.collateralService.getDeleteAdditionalCollaterals(this.selectCollateralId, this.userId).subscribe((res: any) => {
            const apiError = res.ProcessVariables.error.message;
    
            if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
              this.toasterService.showSuccess(apiError, 'Delete Additional Collateral Details');
              this.getVehicleDetails(this.leadId)
            } else {
              this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : apiError, 'Delete Additional Collateral Details')
            }
          }, error => {
            console.log('error', error);
          });
    
        }
      }

}
