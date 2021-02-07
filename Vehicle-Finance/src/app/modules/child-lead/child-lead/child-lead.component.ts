import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ToastrService } from 'ngx-toastr';
import { CommonDataService } from '@services/common-data.service';
import { LoginStoreService } from '@services/login-store.service';

import { LeadHistoryService } from '@services/lead-history.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-child-lead',
  templateUrl: './child-lead.component.html',
  styleUrls: ['./child-lead.component.css']
})
export class ChildLeadComponent implements OnInit {

  childLeadForm: FormGroup;
  labels: any;
  nameLength: number;
  mobileLength: number;
  isSO: any;
  


  constructor(
    private labelsData: LabelsService,
    private toasterService: ToastrService,
    private commonDataService: CommonDataService,
    private loginStoreService: LoginStoreService,
    private leadHistoryService: LeadHistoryService,
    private toastersService: ToasterService,

  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    const userDetails = this.loginStoreService.getRolesAndUserDetails();
    this.isSO = userDetails.roles[0].roleId;
    console.log('userDetails', userDetails);
    console.log('bod ', this.childLeadForm.controls.dateOfBirth);
  }
  onLeadHistory() {
    const formValue = this.childLeadForm.getRawValue();
    const childLoanDatas: any = { ...formValue };
    if(this.childLeadForm.controls.leadNumber.valid){
      let leadId = childLoanDatas.leadNumber
    this.leadHistoryService.leadHistoryApi(parseInt(leadId))
      .subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;

          if (appiyoError === '0' && apiError === '0') {
            const leadHistoryData = response;
            console.log('leadHistoryData', leadHistoryData);
            if (leadHistoryData.ProcessVariables.leads != null){
            this.commonDataService.shareLeadHistoryData(leadHistoryData);
          }else {
            this.commonDataService.shareLeadHistoryData(null);
          }

          } else {
            const message = response.ProcessVariables.error.message;
            this.toastersService.showError(message, 'Lead Creation');
          }
        }
      );
    } else {
      this.toasterService.error(
        'Lead ID is mandatory'
      );
    }
    
  }

  initForm() {
    this.childLeadForm = new FormGroup({
      //ucic: new FormControl('', Validators.required),
      leadNumber: new FormControl('', Validators.required)
      // vehicleRegistrationNumber: new FormControl('', Validators.required),
      // aadhaar: new FormControl('', Validators.required),
      // drivingLicense: new FormControl('', Validators.required),
      // voterId: new FormControl('', Validators.required),
      // passport: new FormControl('', Validators.required),
      // pan: new FormControl('', Validators.required),
      // cin: new FormControl('', Validators.required),
      // tan: new FormControl('', Validators.required),
      // gst: new FormControl('', Validators.required),
      // name: new FormControl('', Validators.required),
      // mobile: new FormControl('', Validators.required),
      // dateOfBirth: new FormControl('', Validators.required)
    });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = data.validationData.name.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );

  }
}

