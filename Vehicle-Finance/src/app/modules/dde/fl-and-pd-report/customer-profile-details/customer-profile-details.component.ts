import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { CustomerProfile } from '@model/dde.model';
import { CommomLovService } from '@services/commom-lov-service';
// import { MessageService } from '@progress/kendo-angular-l10n';
@Component({
  selector: 'app-customer-profile-details',
  templateUrl: './customer-profile-details.component.html',
  styleUrls: ['./customer-profile-details.component.css']
})
export class CustomerProfileDetailsComponent implements OnInit {

  customerProfileForm: FormGroup;

  public customerProfileLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;
  leadId: number;
  userId: number;
  LOV: any = [];

  custProfileDetails: CustomerProfile;

  employeeSeenPattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Numbers Only Required',
  };

  maxlength10 = {
    rule: 10,
    msg: '',
  };


  mismatchAddressPattern = {
    rule: '^[0-9A-Za-z, _&*#/\\-@]{0,99}$',
    msg: 'Invalid Landmark',
  };

  maxlength40 = {
    rule: 40,
    msg: '',
  };
  isDirty: boolean;

  constructor(private labelsData: LabelsService,
              private lovDataService: LovDataService,
              private router: Router,
              private ddeStoreService: DdeStoreService,
              private personalDiscusion: PersonalDiscussionService,
              private toasterService: ToasterService,
              private commonLovService: CommomLovService) { }

  ngOnInit() {

    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });

    this.getLOV();

    this.lovDataService.getLovData().subscribe((value: any) => {
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
      // console.log("lov customer", this.customerProfileLov)
      // this.setFormValue();
    });

  }
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
  }

  initForm() {
    this.customerProfileForm = new FormGroup({
      offAddSameAsRecord: new FormControl('', Validators.required),
      noOfEmployeesSeen: new FormControl('', Validators.required),
      nameBoardSeen: new FormControl('', Validators.required),
      officePremises: new FormControl('', Validators.required),
      sizeofOffice: new FormControl('', Validators.required),
      customerProfileRatingSo: new FormControl('', Validators.required),
      mismatchAddress: new FormControl('', Validators.required),
      customerHouseSelfie: new FormControl('', Validators.required),
      ownershipAvailable: new FormControl('', Validators.required),
      mandatoryCustMeeting: new FormControl('', Validators.required)
    });
  }

  setFormValue() {

    const customerProfileModal = this.ddeStoreService.getCustomerProfile() || {};

    this.customerProfileForm.patchValue({
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchAddress: customerProfileModal.mismatchAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      ownershipProof: customerProfileModal.ownershipAvailable || '',
      metCustomer: customerProfileModal.mandatoryCustMeeting || ''
    });
  }



  onFormSubmit() {
    const formModal = this.customerProfileForm.value;

    // coverting the stirng format into number format
    this.customerProfileForm.value.offAddSameAsRecord = parseInt(this.customerProfileForm.value.offAddSameAsRecord);
    formModal.noOfEmployeesSeen = parseInt(formModal.noOfEmployeesSeen);
    formModal.nameBoardSeen = parseInt(formModal.nameBoardSeen);
    formModal.customerHouseSelfie = parseInt(formModal.customerHouseSelfie);
    formModal.ownershipAvailable = parseInt(formModal.ownershipAvailable);
    formModal.mandatoryCustMeeting = parseInt(formModal.mandatoryCustMeeting);
    console.log('Control Value', this.customerProfileForm.get('offAddSameAsRecord'));
    this.isDirty = true;
    if (
      // this.customerProfileForm.get('offAddSameAsRecord').invalid ||
      // this.customerProfileForm.get('nameBoardSeen').invalid ||
      // this.customerProfileForm.get('officePremises').invalid
      this.customerProfileForm.invalid
    ) {
      //this.isDirty = true;
      return;
    }
    const customerProfileModal = { ...formModal };
    console.log('profile form', customerProfileModal);
    this.custProfileDetails = {
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchAddress: customerProfileModal.mismatchAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      ownershipAvailable: customerProfileModal.ownershipAvailable || '',
      mandatoryCustMeeting: customerProfileModal.mandatoryCustMeeting || '',
    };
    const data = {
      leadId: 1,
      applicantId: 6,
      userId: '1002',
      customerProfileDetails: this.custProfileDetails
    };

    this.personalDiscusion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('customer Profle Details saved !', '');
      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });

    // this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
  }

}
