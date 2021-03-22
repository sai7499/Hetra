import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LabelsService } from '@services/labels.service';
import { VehicleValuationService } from '../services/vehicle-valuation.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-vehicle-valuation',
  templateUrl: './vehicle-valuation.component.html',
  styleUrls: ['./vehicle-valuation.component.css']
})
export class VehicleValuationComponent implements OnInit {
  modalDataForm: FormGroup;

  leadId;
  colleteralId;

  labels: any = {};
  LOV: any = [];
  collateralDetailsData: any = [];
  regNo: any;
  model: any;
  make: any;
  address: any;
  valuationReport: string;
  valuatorStatus: string;
  apiValuatorStatus: string;
  apiValuationStatus: string;

  vendorDetails; any = [];
  vendorDetailsData: any = [];
  vendorName: any;

  isModal: boolean;
  isOk: boolean;
  isYes: boolean;
  isDirty: boolean;
  disableSaveBtn: boolean;

  isLoan360: boolean;
  roleId: any;
  roleName: any;
  roles: any;
  roleType: any;
  extValuator: boolean;
  @ViewChild('closeModal1', { static: false }) public closeModal1: ElementRef;
  branchDetails: any;
  valuatorSelect = true;
  userDetails: any;
  keyValue: any;
  getBranchDetails: any;
  isInternalValuator: any;
  version: any = [];
  url: string;
  isValuableVersion: any;
  isReInitiate: any;

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private vehicleValuationService: VehicleValuationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService,
    private loginStoreService: LoginStoreService,
    private location: Location
  ) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and

    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    this.url = this.location.path();
    if (this.roleId === 86 || !this.url.includes('dde')) {
      this.extValuator = true;
    } else {
      this.extValuator = false;
    }

    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.getLabels();
    this.initForm();
    this.getLOV();
    this.getLeadId();
    this.getCollateralDetailsForVehicleValuation();
    this.getVendorCode();
    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.modalDataForm.disable();
      this.disableSaveBtn = true;
    }

    if (this.loanViewService.checkIsLoan360()) {
      this.modalDataForm.disable();
      this.disableSaveBtn = true;
    }
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
    });
  }

  initForm() {
    this.modalDataForm = this.formBuilder.group({
      remarks: [''],
      valuatorCode: [''],
      isInternalValuation: ['', Validators.required],
      branchName: [''],
      internalValuationUser: ['']
    });
  }

  getCollateralDetailsForVehicleValuation() {
    const data = this.leadId;

    const isValuationInitiated = this.roleId === 86 || !this.url.includes('dde') ? true : false;
    this.vehicleValuationService.getCollateralDetailsForVehicleValuation(data, isValuationInitiated).
      subscribe((res: any) => {
        const response = res;
        this.collateralDetailsData = response.ProcessVariables.collateralDetails;
        this.version = response.ProcessVariables.vehicleValuationVersionList;
        console.log(this.version, 'after')
        if (this.collateralDetailsData) {
          this.collateralDetailsData.forEach((element) => {
            this.colleteralId = element.collateralId;
            this.apiValuatorStatus = element.valuatorStatus;
            this.apiValuationStatus = element.valuationStatus;
            this.regNo = element.regNo;
            this.make = element.make;
            this.model = element.model;
            this.address = element.address;

          });
        }
        this.getValuatorStatus();
        this.getValuationReport();
      });
  }

  getValuatorStatus() {
    if (this.apiValuatorStatus === '1') {
      this.valuatorStatus = 'Online';
    } else if (this.apiValuatorStatus === '0') {
      this.valuatorStatus = 'Offline';
    }
  }

  getValuationReport() {
    if (this.apiValuationStatus === 'NOT INITIATED' && this.apiValuatorStatus === null) {
      this.valuationReport = 'Initiate';
    } else if (this.apiValuationStatus === 'INITIATED' && this.apiValuatorStatus === '1') {
      this.valuationReport = '------';
    } else if (this.apiValuationStatus === 'INITIATED' && this.apiValuatorStatus === '0') {
      this.valuationReport = 'View';
    } else if (this.apiValuationStatus === 'SUBMITTED' && this.apiValuatorStatus === '1') {
      this.valuationReport = 'View';
    } else if (this.apiValuationStatus === 'SUBMITTED' && this.apiValuatorStatus === '0') {
      this.valuationReport = 'View';
    } else if (this.apiValuationStatus === 'RECEIVED' && this.apiValuatorStatus === '1') {
      this.valuationReport = 'View';
    }
  }

  getVendorCode() {
    const data  = {
      leadId: this.leadId
    }
    this.vehicleValuationService.getVendorCode(data).subscribe((res: any) => {

      this.vendorDetails = res.ProcessVariables.vendorDetails;
      this.branchDetails = res.ProcessVariables.branchDetails;
      this.isInternalValuator = res.ProcessVariables.isInternalValuation;
      this.vendorDetails.filter((element) => {
        const data = {
          key: element.vendorCode,
          value: element.vendorName
        };
        this.vendorDetailsData.push(data);
      });
    });
  }

  onBankNameClear(val) {
    this.modalDataForm.patchValue({
      internalValuationUser: '',
    })
    this.userDetails = [];
  }
  onSelectValuator(event) {
    console.log(event, 'event');
    if (event == '1') {
      this.modalDataForm.patchValue({
        branchName: this.branchDetails[0].key
      });
      this.getUserByBranch();
      this.modalDataForm.get('branchName').setValidators(Validators.required);
      this.modalDataForm.get('internalValuationUser').setValidators(Validators.required);
      this.modalDataForm.get('valuatorCode').clearValidators();
      this.modalDataForm.get('valuatorCode').updateValueAndValidity();
      setTimeout(() => {
        this.modalDataForm.get('valuatorCode').setValue(null); 
      });
    } else if(event == '0') {
      this.modalDataForm.get('valuatorCode').setValidators(Validators.required);
      this.modalDataForm.get('branchName').clearValidators();
      this.modalDataForm.get('internalValuationUser').clearValidators();
      this.modalDataForm.get('valuatorCode').updateValueAndValidity();
      setTimeout(() => {
      this.modalDataForm.get('internalValuationUser').setValue(null); 
      this.modalDataForm.get('branchName').setValue(null); 
      });
    }
  }

  onChangeBranchName(event) {
    console.log(event);
    
    this.getUserByBranch();
  }

  getUserByBranch() {
    const data = {
      branchId: Number(this.modalDataForm.get('branchName').value)
    }
    this.vehicleValuationService.getUserByBranch(data).subscribe((res: any) => {
      this.getBranchDetails = res.ProcessVariables.users;
      console.log(this.userDetails);
      
      
    })
  }

  onBankNameSearch(val) {
    if (val && val.trim().length > 0) {
      this.userDetails = this.getBranchDetails.filter(e => {
        let myVal = val.toString().toLowerCase();
        const eName = e.value.toString().toLowerCase();
        const eValue = e.key.toString().toLowerCase();
        if (eName.includes(myVal) || eValue.includes(myVal)) {
          e.Name = e.value + ' - ' + e.key;
          console.log('onSearch', e);
          
          return e;
        }
      });
    }
  }

  selectBankNameEvent(val: any) {
    console.log(val, 'val')
    this.keyValue = val;
    this.modalDataForm.patchValue({
      internalValuationUser: val['Name']
    })
    this.vendorName = val['Name'];
  }

  onChangeVendorName(event: any) {
    const vendorNameChange = event.target.value;
    this.vendorDetailsData.filter(element => {
      if (element.key == vendorNameChange) {
        this.vendorName = element.value;
      }
    });
  }


  initiateVehicleValuation() {
    // this.isDirty = true;
    if(this.modalDataForm.get('isInternalValuation').value == '0') {
      this.modalDataForm.patchValue({
        internalValuationUser: '',
      })
    } else if(this.modalDataForm.get('isInternalValuation').value == '1') {
      this.modalDataForm.patchValue({
        internalValuationUser: this.keyValue.key ? this.keyValue.key : '' ,
      })
    }
    this.modalDataForm.get('isInternalValuation').value
    console.log( this.modalDataForm.get('isInternalValuation').value);
    
    const formValues = this.modalDataForm.getRawValue();

    formValues.isInternalValuation == 1 ? formValues.isInternalValuation = true : false;
    formValues.isInternalValuation == 0 ? formValues.isInternalValuation = false : true;

    const data = {
      userId: localStorage.getItem('userId'),
      collateralId: this.colleteralId,
      ...formValues
    };
    console.log(data);
    // if (this.modalDataForm.valid === true) {
      this.vehicleValuationService.initiateVehicleValuation(data).subscribe((res) => {
        const response = res;

        if (response["Error"] == 0 && response["ProcessVariables"]["error"]["code"] == 0) {
          this.toasterService.showSuccess('Valuation Initiated Successfully', '');
          const getData = response["ProcessVariables"]["collateralDetails"];
          this.getCollateralDetailsForVehicleValuation();
          this.isOk = false;
          return this.collateralDetailsData.forEach(element => {
            if (element.collateralId == getData.collateralId) {
              element.valuationStatus = getData.valuationStatus;
              element.valuatorStatus = getData.valuatorStatus;
            }
          });

        } else {
          this.toasterService.showError(response["ProcessVariables"]["error"]["message"],
            '');
        }
      });
    // } else {
    //   this.toasterService.showError('Please fill all mandatory fields', '');
    // }

  }

  onClickValuationReport(status, collateralId, extValuator: boolean, version?, index?) {
    console.log(version,'COLLATERAL_ID::', collateralId);
    this.colleteralId = collateralId;
    console.log('vStatus', status);
    const data = this.collateralDetailsData.find((element) => {
      return element.collateralId === collateralId;
    });

    this.sharedService.setValuationType(extValuator);
    
    if (status == 'NOT INITIATED') {
      this.regNo = data.regNo;
      this.make = data.make;
      this.model = data.model;
      this.address = data.address;
      this.isModal = true;
      this.regNo = data.regNo;
      this.make = data.make;
      this.model = data.model;
      this.address = data.address;
    } else {
      this.isModal = false;
      if (version) {
        const valuationArrayLength = this.collateralDetailsData.length-1;
        if(valuationArrayLength == index) {
          this.isReInitiate = true;
        } else {
          this.isReInitiate = false;
        }
        this.sharedService.getversion({'version': version, 
        'isReinitiate': this.isReInitiate});

        console.log(valuationArrayLength);
        // return;
        // this.sharedService.getversion({'version': version, 'versionArray': this.version})
      }
     this.sharedService.setIsReinitiate(this.url)
      this.router.navigateByUrl(`/pages/vehicle-valuation/${this.leadId}/valuation/${collateralId}`);

    }
  }

  closeModal() {
    this.isModal = false;
    this.isOk  = false;
    this.modalDataForm.get('internalValuationUser').setValue('');
  }

  okModal() {
    this.isDirty = true;
    console.log(this.modalDataForm);
    if(!this.isInternalValuator) {
      this.modalDataForm.get('isInternalValuation').clearValidators();
      this.modalDataForm.get('isInternalValuation').updateValueAndValidity();
      this.modalDataForm.get('valuatorCode').setValidators(Validators.required);
      this.modalDataForm.get('valuatorCode').updateValueAndValidity();

    }
    
    if(this.modalDataForm.valid === true) {
      this.closeModal1.nativeElement.click();
    this.isOk = true;
    } else {
      this.toasterService.showError('Please enter mandatory fields', '')
    }
  }

  yesModal() {
    this.isYes = true;
  }

  onNext() {
    this.router.navigate([`/pages/dde/${this.leadId}/tvr-details`]);
    // this.sharedService.getVehicleValuationNext(true);
    this.sharedService.getPslDataNext(true);
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/psl-data`]);
  }
  onNavigateToValuationSummary() { // func to route to the valuation dashboard
    this.router.navigate([`/pages/dashboard`]);
  }

}
