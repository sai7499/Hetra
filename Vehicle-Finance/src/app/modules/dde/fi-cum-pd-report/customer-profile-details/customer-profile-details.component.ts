import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { CustomerProfile } from '@model/dde.model';
import { CommomLovService } from '@services/commom-lov-service';
import { PdDataService } from '../pd-data.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoanViewService } from '@services/loan-view.service';
import { FicumpdPdfService } from '@services/ficumpd-pdf.service';

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
  data: any;

  custProfileDetails: CustomerProfile;

  leadData: any;
  isDirty: boolean;
  applicantId: number;
  version: string;
  roleName: string;
  roles: any;
  userName: any;
  roleId: any;
  roleType: any;
  disableSaveBtn: boolean;
  operationType: boolean;
  addressStatus: any;
  addressDisabled: boolean;
  addressRequired: boolean;
  entityTypeKey: string;
  custCategory: string;
  nameBoardSeenDisabled: boolean;
  nameBoardSeenRequired: boolean;

  // userDefineFields
  udfScreenId = 'FPS002';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'FPG001';
  entityType: any;
  isNonInd: boolean;

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private toasterService: ToasterService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private pdDataService: PdDataService,
    private personalDiscussion: PersonalDiscussionService,
    private toggleDdeService: ToggleDdeService,
    private createLeadDataService: CreateLeadDataService,
    private loanViewService: LoanViewService,
    private ficumpdPdfService: FicumpdPdfService
  ) { }

  async ngOnInit() {

    this.leadId = (await this.getLeadId()) as number;

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    //this.udfScreenId = this.roleType === 1 ? 'FPS002' : 'FPS006';

    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });

    this.getLOV();
    this.getPdDetails();

    this.lovDataService.getLovData().subscribe((value: any) => {
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
    });
    this.operationType = this.toggleDdeService.getOperationType();
    if (this.operationType) {
      this.customerProfileForm.disable();
      this.disableSaveBtn = true;
    }

    if (this.loanViewService.checkIsLoan360()) {
      this.customerProfileForm.disable();
      this.disableSaveBtn = true;
    }

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 1 ? udfScreenId.FICUMPD.customerProfileFIcumPD : udfScreenId.DDE.customerProfileDetailsFIcumPDDDE ;

    })
    this.entityType = this.pdDataService.getFiCumPdApplicantType();
      if(this.entityType !== 'Individual'){
        this.isNonInd = true
      }else{
        this.isNonInd = false
      }

  }
  getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadData = { ...leadSectionData };
    const data = this.leadData;

    for (const value of data['applicantDetails']) {
      if (value['applicantId'] === Number(this.applicantId)) {
        const applicantDetailsFromLead = value;
        this.entityTypeKey = applicantDetailsFromLead['entityTypeKey'];
      }
    }
  }

  getCustSegmentAndEntity() {
    if ((this.entityTypeKey == "INDIVENTTYP" && this.custCategory == "SEMCUSTSEG") || (this.entityTypeKey == "NONINDIVENTTYP")) {

      this.nameBoardSeenRequired = true;
      this.nameBoardSeenDisabled = false;
      this.customerProfileForm.get('nameBoardSeen').enable();
      this.customerProfileForm.get('nameBoardSeen').setValidators(Validators.required);
      this.customerProfileForm.get('nameBoardSeen').updateValueAndValidity();

    } else if ((this.entityTypeKey == "INDIVENTTYP" && this.custCategory != "SEMCUSTSEG") || (this.entityTypeKey != "NONINDIVENTTYP")) {

      this.nameBoardSeenRequired = false;
      this.nameBoardSeenDisabled = true;
      setTimeout(() => {
        this.customerProfileForm.get('nameBoardSeen').setValue(null);

      });
      this.customerProfileForm.get('nameBoardSeen').disable();
      this.customerProfileForm.get('nameBoardSeen').clearValidators();
      this.customerProfileForm.get('nameBoardSeen').updateValueAndValidity();

    }
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      this.getLeadSectionData();
    });
  }

  initForm() {

    this.customerProfileForm = new FormGroup({
      offAddSameAsRecord: new FormControl('', Validators.required),
      noOfEmployeesSeen: new FormControl('', Validators.required),
      nameBoardSeen: new FormControl(''),
      officePremises: new FormControl('', Validators.required),
      sizeofOffice: new FormControl('', Validators.required),
      customerProfileRatingSo: new FormControl('', Validators.required),
      mismatchInAddress: new FormControl(''),
      customerHouseSelfie: new FormControl('', Validators.required),
      mandatoryCustMeeting: new FormControl('', Validators.required),
      locality: new FormControl('', Validators.required)
    });
  }

  addressMismatch(event: any) { // fun for conditional mandatory for mismatch in off/buss address
    this.addressStatus = event ? event : event;
    const mismatchInAddress = this.customerProfileForm.get('mismatchInAddress').value;
    if (this.addressStatus === '1') {
      this.addressDisabled = true;
      this.addressRequired = false;
      this.customerProfileForm.get('mismatchInAddress').disable();
      this.customerProfileForm.get('mismatchInAddress').updateValueAndValidity();
      setTimeout(() => {
        this.customerProfileForm.get('mismatchInAddress').patchValue(null);
      });
    } else if (this.addressStatus !== '1') {
      this.addressDisabled = false;
      this.addressRequired = true;
      this.customerProfileForm.get('mismatchInAddress').enable();
      this.customerProfileForm.get('mismatchInAddress').setValidators(Validators.required);
      setTimeout(() => {
        this.customerProfileForm.get('mismatchInAddress').patchValue(mismatchInAddress || null);
      });

    }
  }

  getPdDetails() {
    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.custProfDetails = value.ProcessVariables.customerProfileDetails;
        this.ficumpdPdfService.setcustomerProfileDetails(this.custProfDetails);

        console.log('calling get api ', this.custProfDetails);
        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];

        if (this.entityTypeKey == "INDIVENTTYP") {
          this.custCategory = value.ProcessVariables.applicantPersonalDiscussionDetails ? value.ProcessVariables.applicantPersonalDiscussionDetails.custCategory : null ;
        } else if (this.entityTypeKey == "NONINDIVENTTYP") {
          this.custCategory = null;
        }
        if (this.custProfDetails) {
          this.getCustSegmentAndEntity();
          this.setFormValue();
        }
        if (this.customerProfileForm.get('offAddSameAsRecord') != null) {
          this.addressMismatch(this.customerProfileForm.get('offAddSameAsRecord').value);
        }
      }
    });

  }

  setFormValue() {
    const customerProfileModal = this.custProfDetails || {};

    this.customerProfileForm.patchValue({
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchInAddress: customerProfileModal.mismatchInAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      mandatoryCustMeeting: customerProfileModal.mandatoryCustMeeting || '',
      locality: customerProfileModal.locality || ''
    });
  }

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
  }

  onFormSubmit(action) {
    if (this.operationType) {
      this.onNavigateNext();
      return;
    }
    const formModal = this.customerProfileForm.value;
    let customerProfileModel = { ...formModal };

    const customerProfileFormModal = { ...formModal };
    this.custProfileDetails = {
      offAddSameAsRecord: customerProfileFormModal.offAddSameAsRecord,
      noOfEmployeesSeen: customerProfileFormModal.noOfEmployeesSeen,
      nameBoardSeen: customerProfileFormModal.nameBoardSeen,
      officePremises: customerProfileFormModal.officePremises,
      sizeofOffice: customerProfileFormModal.sizeofOffice,
      customerProfileRatingSo: customerProfileFormModal.customerProfileRatingSo,
      mismatchInAddress: customerProfileFormModal.mismatchInAddress,
      customerHouseSelfie: customerProfileFormModal.customerHouseSelfie,
      mandatoryCustMeeting: customerProfileFormModal.mandatoryCustMeeting,
      locality: customerProfileFormModal.locality
    };

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.customerProfileForm.valid && isUdfField) {

      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        customerProfileDetails: this.custProfileDetails,
        udfDetails: [
          {
            "udfGroupId": this.udfGroupId,
            // "udfScreenId": this.udfScreenId,
            "udfData": JSON.stringify(
              this.userDefineForm && this.userDefineForm.udfData ?
                this.userDefineForm.udfData.getRawValue() : {}
            )
          }
        ]
      };

      this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', '');
          if (action === 'save') {
            customerProfileModel = {};
            this.getPdDetails();
          } else if (action === 'next') {
            this.onNavigateNext();
          }
        } else {
          const message = res.processVariables.error.message;
          this.toasterService.showError(message, 'message');
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showError('please enter required details', '');
    }
  }

  onNavigateNext() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details`]);
    }
  }

  onNavigateBack() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/applicant-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/applicant-details`]);
    }
  }

}
