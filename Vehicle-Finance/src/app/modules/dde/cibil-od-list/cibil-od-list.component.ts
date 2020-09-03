import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { OdDetailsService } from '@services/od-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { UtilityService } from '@services/utility.service';
import { ApplicantImageService } from '@services/applicant-image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cibil-od-list',
  templateUrl: './cibil-od-list.component.html',
  styleUrls: ['./cibil-od-list.component.css'],
})
export class CibilOdListComponent implements OnInit {
  labels: any;
  odDetailsForm: any;
  odAccountDetails: FormGroup;
  AssetBureauEnquiry: FormGroup;
  AssetBureauEnquirySixtyDays: FormGroup;
  odAccountDetailsArray: FormArray;
  AssetBureauEnquiryArray: FormArray;
  AssetBureauEnquirySixtyDaysArray: FormArray;
  selctedLoan = [];
  selectedLoanType: any;
  submitted = null;
  totalOdAmount = 0;
  leadId: number;
  userId: string;
  odListLov: any = [];
  applicantId: number;
  odApplicantList: any;
  public toDayDate: Date = new Date();
  odDetails: any;
  applicantType: any;
  odApplicantData: any;
  isDirty = false;
  isODModelShow: boolean;
  rowIndex;
  errorMessage;
  isThirtyModelShow: boolean;
  rowoIndex: any;
  isSixtyModelShow: boolean;
  selctedProof: any;
  unamePattern = '^[a-z0-9_-]{8,15}$';
  imageUrl: any;
  cibilImage: any;
  constructor(
    private labelService: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private toasterService: ToasterService,
    private odDetailsService: OdDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantDataService: ApplicantDataStoreService,
    private utilityService: UtilityService,
    private applicantImageService: ApplicantImageService,
    private domSanitizer: DomSanitizer
  ) {
    this.odAccountDetailsArray = this.formBuilder.array([]);
    this.AssetBureauEnquiryArray = this.formBuilder.array([]);
    this.AssetBureauEnquirySixtyDaysArray = this.formBuilder.array([]);
  }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe((res) => {
      this.labels = res;
    });
    this.getLeadId();
    this.userId = localStorage.getItem('userId');

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
    });

    this.odDetailsForm = this.formBuilder.group({
      odAccountDetails: this.odAccountDetailsArray,
      AssetBureauEnquiry: this.AssetBureauEnquiryArray,
      AssetBureauEnquirySixtyDays: this.AssetBureauEnquirySixtyDaysArray,
      totalAmount: this.totalOdAmount,
      highDpd6m: [''],
      highDpd12m: [''],
      writtenOffLoans: [''],
      writtenOffLoansWithSuite: [''],
      lossLoans: [''],
      settledLoans: [''],
      clearanceProofCollected: [''],
      clearanceProof: [null],
      justification: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
              ),
    ])

      });
    this.getLov();
    this.getOdDetails();
    this.getOdApplicant();
    console.log(this.odDetailsForm.value.clearanceProof);

  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log("lov values ....>",value)
      this.odListLov.odApplicantType = value.LOVS.odApplicantType;
      this.odListLov.typeOfLoan = value.LOVS.typeOfLoan;
      this.odListLov.clearanceProof = value.LOVS.clearanceProof;
      console.log(this.odListLov.clearanceProof);
      this.odListLov.highestDpd = value.LOVS.highestDpd;
      this.odListLov.cibilStatus = value.LOVS.cibilStatus;
      
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }

  onSelectLoan(event, i) {
    this.selctedLoan[i] = event;
    console.log(this.selctedLoan);
    this.selectedLoanType = this.selctedLoan[i];
  }
  onSelectProof(event) {
    this.selctedProof = null;
    this.selctedProof = event;
    console.log(event);

  }
  private getodListDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        odType: [''],
        odAmount: [''],
        typeOfLoan: [''],
        otherTypeOfLoan: [''],
        odDpd: [''],
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        odType: [data.odType ? data.odType : ''],
        odAmount: [data.odAmount ? data.odAmount : ''],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ''],
        otherTypeOfLoan: [data.otherTypeOfLoan ? data.otherTypeOfLoan : ''],
        odDpd: [data.odDpd ? data.odDpd : ''],
      });
    }
  }
  addOdDetails(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.odAccountDetailsArray.push(this.getodListDetails(data[i]));
      }
    } else {
      this.odAccountDetailsArray.push(this.getodListDetails());
    }
  }

  removeOdDetails(i?: any) {
    const id = this.odAccountDetailsArray.at(i).value.id;
    if (this.odAccountDetailsArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {

        this.odAccountDetailsArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'OD Details');
        this.isODModelShow = false;
        this.onOdAmount(null, i);

      } else {
        const body = {
          id,
          userId: this.userId,
        };
        this.odDetailsService
          .softDeleteOdDetails(body)
          .subscribe((res: any) => {
            this.odAccountDetailsArray.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.isODModelShow = false;
            this.onOdAmount(null, i);

          });
      }
    }

  }
  private getAssetBureauEnquiry(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        memberType: [''],
        enquiryDate: [''],
        typeOfLoan: [''],
        amount: [''],
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        memberType: [data.memberType ? data.memberType : ''],
        enquiryDate: [
          data.enquiryDate
            ? this.utilityService.getDateFromString(data.enquiryDate)
            : '',
        ],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ''],
        amount: [data.amount ? data.amount : ''],
      });
    }
  }
  addLastThirtyDaysLoan(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.AssetBureauEnquiryArray.push(this.getAssetBureauEnquiry(data[i]));
      }
    } else {
      this.AssetBureauEnquiryArray.push(this.getAssetBureauEnquiry());
    }
  }
  removeLastThirtyDaysLoan(i?: any) {
    const id = this.AssetBureauEnquiryArray.at(i).value.id;
    if (this.AssetBureauEnquiryArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.AssetBureauEnquiryArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'Last Thirty Days Loan Details');
        this.isThirtyModelShow = false;
      } else {
        const body = {
          id,
          userId: this.userId,
        };
        this.odDetailsService
          .softDeleteBureauEnquiry(body)
          .subscribe((res: any) => {
            this.AssetBureauEnquiryArray.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.isThirtyModelShow = false;

          });
      }
    }

  }
  private getAssetBureauEnquirySixtyDays(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        memberType: [''],
        enquiryDate: [''],
        typeOfLoan: [''],
        amount: [''],
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        memberType: [data.memberType ? data.memberType : ''],
        enquiryDate: [
          data.enquiryDate
            ? this.utilityService.getDateFromString(data.enquiryDate)
            : '',
        ],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ''],
        amount: [data.amount ? data.amount : ''],
      });
    }
  }
  addLastSixtyDaysLoan(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.AssetBureauEnquirySixtyDaysArray.push(
          this.getAssetBureauEnquirySixtyDays(data[i])
        );
      }
    } else {
      this.AssetBureauEnquirySixtyDaysArray.push(
        this.getAssetBureauEnquirySixtyDays()
      );
    }
  }
  removeLastSixtyDaysLoan(i?: any) {
    const id = this.AssetBureauEnquirySixtyDaysArray.at(i).value.id;
    if (this.AssetBureauEnquirySixtyDaysArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.AssetBureauEnquirySixtyDaysArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'Last Thirty Days Loan Details');
        this.isSixtyModelShow = false;
      } else {
        const body = {
          id,
          userId: this.userId,
        };
        this.odDetailsService
          .softDeleteBureauEnquiry(body)
          .subscribe((res: any) => {
            this.AssetBureauEnquirySixtyDaysArray.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.isSixtyModelShow = false;

          });
      }
    }

  }
  get f() {
    return this.odDetailsForm.controls;
  }

  getOdDetails() {
    const body = {
      userId: this.userId,
      applicantId: this.applicantId,
    };
    this.odDetailsService.getOdDetails(body).subscribe((res: any) => {
      this.odDetails = res.ProcessVariables;
      console.log(this.odDetails);

      this.addLastThirtyDaysLoan(res.ProcessVariables.bureauEnq30days);
      this.addLastSixtyDaysLoan(res.ProcessVariables.bureauEnq60days);

      this.addOdDetails(res.ProcessVariables.odAccountDetails);
      if (this.odDetails.assetAppOdDetails) {
        this.odDetailsForm.patchValue({
          totalAmount: this.odDetails.assetAppOdDetails.totalAmount
            ? this.odDetails.assetAppOdDetails.totalAmount
            : null,
        });
        this.odDetailsForm.patchValue({
          highDpd6m: this.odDetails.assetAppOdDetails.highDpd6m,
        });
        this.odDetailsForm.patchValue({
          highDpd12m: this.odDetails.assetAppOdDetails.highDpd12m,
        });
        this.odDetailsForm.patchValue({
          writtenOffLoans: this.odDetails.assetAppOdDetails.writtenOffLoans,
        });
        this.odDetailsForm.patchValue({
          writtenOffLoansWithSuite: this.odDetails.assetAppOdDetails
            .writtenOffLoansWithSuite,
        });
        this.odDetailsForm.patchValue({
          lossLoans: this.odDetails.assetAppOdDetails.lossLoans,
        });
        this.odDetailsForm.patchValue({
          settledLoans: this.odDetails.assetAppOdDetails.settledLoans,
        });
        this.odDetailsForm.patchValue({
          clearanceProofCollected: this.odDetails.assetAppOdDetails
            .clearanceProofCollected,
        });
        this.onSelectProof(this.odDetails.assetAppOdDetails.clearanceProofCollected);
        this.odDetailsForm.patchValue({
          clearanceProof: this.odDetails.assetAppOdDetails.clearanceProof,
        });


        this.odDetailsForm.patchValue({
          justification: this.odDetails.assetAppOdDetails.justification,
        });
      }
    });

  }
  getOdApplicant() {
    const body = {
      userId: this.userId,
      applicantId: this.applicantId,
    };
    this.odDetailsService.getOdDetails(body).subscribe((res: any) => {
      this.odApplicantData = res.ProcessVariables;
    });
  }
  onSubmit() {
    console.log(this.odDetailsForm);

    this.submitted = true;
    // stop here if form is invalid
    if (this.odDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'OD Details'
      );
      return;
    } else {
      this.submitted = true;

      this.odDetailsForm.value.odAccountDetails.forEach((ele) => {
        ele.odType = ele.odType.toString();
        ele.otherTypeOfLoan = ele.otherTypeOfLoan.toString();
        ele.typeOfLoan = ele.typeOfLoan.toString();
        ele.odAmount = ele.odAmount.toString();
        ele.odDpd = Number(ele.odDpd);
      });
      this.odDetailsForm.value.AssetBureauEnquiry.forEach((ele) => {
        ele.memberType = ele.memberType.toString();
        ele.enquiryDate = this.utilityService.convertDateTimeTOUTC(
          ele.enquiryDate,
          'DD/MM/YYYY'
        );
        ele.typeOfLoan = ele.typeOfLoan.toString();
        ele.amount = ele.amount.toString();
      });

      this.odDetailsForm.value.AssetBureauEnquirySixtyDays.forEach((ele) => {
        ele.memberType = ele.memberType.toString();
        ele.enquiryDate = this.utilityService.convertDateTimeTOUTC(
          ele.enquiryDate,
          'DD/MM/YYYY'
        );
        ele.typeOfLoan = ele.typeOfLoan.toString();
        ele.amount = ele.amount.toString();
      });
      const body = {
        userId: this.userId,
        applicantId: this.applicantId,
        odAccountDetails: this.odDetailsForm.controls.odAccountDetails.value,
        AssetBureauEnquiry: this.odDetailsForm.controls.AssetBureauEnquiry
          .value,
        AssetBureauEnquirySixtyDays: this.odDetailsForm.controls
          .AssetBureauEnquirySixtyDays.value,

        assetAppOdDetails: {
          clearanceProof: this.odDetailsForm.controls.clearanceProof.value,
          clearanceProofCollected: this.odDetailsForm.controls
            .clearanceProofCollected.value,
          highDpd12m: this.odDetailsForm.controls.highDpd12m.value,
          highDpd6m: this.odDetailsForm.controls.highDpd6m.value,
          justification: this.odDetailsForm.controls.justification.value,
          lossLoans: Number(this.odDetailsForm.controls.lossLoans.value),
          settledLoans: Number(this.odDetailsForm.controls.settledLoans.value),
          writtenOffLoans: Number(
            this.odDetailsForm.controls.writtenOffLoans.value
          ),
          writtenOffLoansWithSuite: Number(
            this.odDetailsForm.controls.writtenOffLoansWithSuite.value
          ),
          totalAmount: this.totalOdAmount.toString(),
        },
      };

      this.odDetailsService.saveParentOdDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const

          const odAccountDetailsControls = this.odDetailsForm.controls
            .odAccountDetails as FormArray;
          odAccountDetailsControls.controls = [];
          const AssetBureauEnquiryControls = this.odDetailsForm.controls
            .AssetBureauEnquiry as FormArray;
          AssetBureauEnquiryControls.controls = [];
          const AssetBureauEnquirySixtyDaysControls = this.odDetailsForm
            .controls.AssetBureauEnquirySixtyDays as FormArray;
          AssetBureauEnquirySixtyDaysControls.controls = [];
          this.toasterService.showSuccess(
            'Saved Successfully',
            'OD Details'
          );
          this.getOdDetails();

        }
      });
    }
  }
  onOdAmount(event: any, i: number) {
    // const odAmount = this.odAccountDetailsArray.value[i].odAmount;
    // const totalOdAmount = odAmount;
    // this.odAccountDetailsArray.at(i).patchValue({ totalOdAmount });
    if (this.odAccountDetailsArray && this.odAccountDetailsArray.length > 0) {
      this.totalOdAmount = 0;
      for (let i = 0; i < this.odAccountDetailsArray.length; i++) {
        this.totalOdAmount = Math.round(
          this.totalOdAmount +
          Number(this.odAccountDetailsArray.value[i].odAmount)
        );
      }
    }
  }
  onBackToODDetails() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/cibil-od`);
  }
  showOdModel(i) {
    this.rowIndex = i;
    this.isODModelShow = true;
    this.errorMessage = 'Are sure to remove row';
  }
  showThirtyModel(i) {
    this.rowoIndex = i;
    this.isThirtyModelShow = true;
    this.errorMessage = 'Are sure to remove row';
  }
  showSixtyModel(i) {
    this.rowIndex = i;
    this.isSixtyModelShow = true;
    this.errorMessage = 'Are sure to remove row';
  }
  //  logic to get cibil response
  getApplicantImage() {

    // tslint:disable-next-line: triple-equals
    if ( this.imageUrl != null) {
       this.cibilImage = this.imageUrl;
       return;
    } else {
     const body = {
       applicantId: this.applicantId
     };
    //  this.backupApplicantId = applicantID;
     this.applicantImageService.getApplicantImageDetails(body).subscribe((res: any) => {
       // tslint:disable-next-line: triple-equals
       if (res.ProcessVariables.error.code == '0') {
         console.log(res);
         const imageUrl = res.ProcessVariables.response;
         console.log(imageUrl);
         this.imageUrl = imageUrl;
         this.imageUrl = atob(this.imageUrl); // decoding base64 string to get xml file
         this.imageUrl = this.domSanitizer.bypassSecurityTrustHtml(this.imageUrl); // sanitizing xml doc for rendering with proper css
         this.cibilImage = this.imageUrl;
       } else {
         this.imageUrl = res.ProcessVariables.error.message;
         this.cibilImage = res.ProcessVariables.error.message;
       }
     });
    }
   }
 destroyImage() {
     if (this.cibilImage) {
      this.cibilImage = null;
     }
   }
}
