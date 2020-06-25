import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { CustomerProfile } from '@model/dde.model';
import { CommomLovService } from '@services/commom-lov-service';
import { PdDataService } from '../pd-data.service';

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
  custProfDetails: any = [];

  custProfileDetails: CustomerProfile;

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private personalDiscusion: PersonalDiscussionService,
    private toasterService: ToasterService,
    private commonLovService: CommomLovService,
    private pdDataService: PdDataService,
    private personalDiscussion: PersonalDiscussionService) { }

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
    // this.commonService()
    this.getPdDetails();
    this.setFormValue();;

    this.lovDataService.getLovData().subscribe((value: any) => {
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
      // console.log("lov customer", this.customerProfileLov)

    });

  }
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
  }

  initForm() {

    this.customerProfileForm = new FormGroup({
      offAddSameAsRecord: new FormControl(''),
      noOfEmployeesSeen: new FormControl(''),
      nameBoardSeen: new FormControl(''),
      officePremises: new FormControl(''),
      sizeofOffice: new FormControl(''),
      customerProfileRatingSo: new FormControl(''),
      mismatchInAddress: new FormControl(''),
      customerHouseSelfie: new FormControl(''),
      ownershipAvailable: new FormControl(''),
      mandatoryCustMeeting: new FormControl('')
    });
  }

  commonService() {
    const customerProfileModal = this.pdDataService.getCustomerProfile();

    if (customerProfileModal) {

      console.log("common variable ", customerProfileModal)
    }
    else {
      console.log("common variable is empty calling get api")

      this.getPdDetails();
    }
  }

  getPdDetails() {
    const data = {
      applicantId: 6,
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.custProfDetails = value.ProcessVariables.customerProfileDetails;
        console.log('calling get api ', this.custProfDetails);

        if (this.custProfDetails) {
          this.pdDataService.setCustomerProfile(this.custProfDetails)
        }
      }
    });

  }

  setFormValue() {

    const customerProfileModal = this.pdDataService.getCustomerProfile() || {};

    console.log('in form value', customerProfileModal)

    this.customerProfileForm.patchValue({
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchInAddress: customerProfileModal.mismatchInAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      ownershipProof: customerProfileModal.ownershipAvailable || '',
      metCustomer: customerProfileModal.mandatoryCustMeeting || ''
    });
  }



  onFormSubmit() {
    const formModal = this.customerProfileForm.value;

    const customerProfileModal = { ...formModal };
    console.log("profile form", customerProfileModal);
    this.custProfileDetails = {
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord,
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen,
      nameBoardSeen: customerProfileModal.nameBoardSeen,
      officePremises: customerProfileModal.officePremises,
      sizeofOffice: customerProfileModal.sizeofOffice,
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo,
      mismatchInAddress: customerProfileModal.mismatchInAddress,
      customerHouseSelfie: customerProfileModal.customerHouseSelfie,
      ownershipAvailable: customerProfileModal.ownershipAvailable,
      mandatoryCustMeeting: customerProfileModal.mandatoryCustMeeting,
    };
    const data = {
      leadId: 1,
      applicantId: 6,
      userId: "1002",
      customerProfileDetails: this.custProfileDetails
    };

    this.personalDiscusion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log("save or update PD Response", res)
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess("customer Profle Details saved !", '')
      }
      else {
        console.log("error", res.ProcessVariables.error.message);
        this.toasterService.showError("ivalid save", 'message')

      }
    })

    // this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
  }

}
